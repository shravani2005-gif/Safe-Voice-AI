import re
import json
import os
from typing import List, Dict, Any, Tuple

DEFAULT_DICT_PATH = os.path.join(os.path.dirname(__file__), "dictionary.json")

class ModerationEngine:
    """
    SafeVoice AI Content Moderation Engine.
    Provides rule-based, boundary-aware bad word & phrase detection and removal.
    """

    def __init__(self, dict_path: str = DEFAULT_DICT_PATH):
        self.dict_path = dict_path
        self.terms: List[str] = []
        self.load_dictionary()

    def load_dictionary(self) -> List[str]:
        """Loads terms from JSON dictionary file."""
        if os.path.exists(self.dict_path):
            try:
                with open(self.dict_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.terms = [t.strip().lower() for t in data.get("terms", []) if t.strip()]
            except Exception as e:
                print(f"Error loading dictionary from {self.dict_path}: {e}")
                self.terms = ["stupid", "idiot", "toxic", "bad comment"]
        else:
            self.terms = ["stupid", "idiot", "toxic", "bad comment"]
        # Remove duplicates while preserving alphabetical order
        self.terms = sorted(list(set(self.terms)))
        return self.terms

    def save_dictionary(self) -> bool:
        """Saves current terms back to the JSON dictionary file."""
        try:
            data = {
                "terms": sorted(list(set(self.terms))),
                "description": "Configurable bad-word dictionary for SafeVoice AI"
            }
            with open(self.dict_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"Error saving dictionary: {e}")
            return False

    def add_term(self, term: str) -> Tuple[bool, str]:
        """Adds a new term or phrase safely."""
        cleaned = term.strip().lower()
        if not cleaned:
            return False, "Term cannot be empty."
        if cleaned in self.terms:
            return False, f"Term '{cleaned}' already exists in dictionary."
        self.terms.append(cleaned)
        self.terms = sorted(list(set(self.terms)))
        self.save_dictionary()
        return True, f"Term '{cleaned}' added successfully."

    def remove_term(self, term: str) -> Tuple[bool, str]:
        """Remmits a term from dictionary."""
        cleaned = term.strip().lower()
        if cleaned not in self.terms:
            return False, f"Term '{cleaned}' not found in dictionary."
        self.terms.remove(cleaned)
        self.save_dictionary()
        return True, f"Term '{cleaned}' removed successfully."

    def build_term_regex(self, term: str) -> str:
        """
        Builds a safe, word-boundary aware regular expression pattern for a term or phrase.
        Safely escapes special characters and allows flexible whitespace for multi-word phrases.
        """
        escaped_parts = [re.escape(part) for part in term.split()]
        # Allow one or more whitespace between words in multi-word phrases
        inner_pattern = r"\s+".join(escaped_parts)

        # Word boundaries: \b only works if boundary character is a word char (\w).
        # For non-word leading/trailing chars, use lookarounds.
        prefix = r"\b" if re.match(r"^\w", term) else r"(?<!\w)"
        suffix = r"\b" if re.search(r"\w$", term) else r"(?!\w)"

        return f"{prefix}{inner_pattern}{suffix}"

    def build_composite_regex(self) -> Tuple[re.Pattern, Dict[str, str]]:
        """
        Builds a combined compiled regex of all terms, ordered by length descending.
        """
        if not self.terms:
            # Pattern that never matches
            return re.compile(r"$^"), {}

        # Sort terms by length descending so longer multi-word phrases match first
        sorted_terms = sorted(self.terms, key=lambda t: len(t), reverse=True)

        patterns = []
        term_map = {}
        for idx, term in enumerate(sorted_terms):
            group_name = f"term_{idx}"
            sub_pattern = self.build_term_regex(term)
            patterns.append(f"(?P<{group_name}>{sub_pattern})")
            term_map[group_name] = term

        full_pattern = "|".join(patterns)
        compiled = re.compile(full_pattern, flags=re.IGNORECASE | re.UNICODE)
        return compiled, term_map

    def moderate(self, text: str, mode: str = "mask") -> Dict[str, Any]:
        """
        Analyzes and moderates input text.
        
        Args:
            text: The raw input text.
            mode: Replacement mode: 'mask' (default), 'replace', or 'remove'.
            
        Returns:
            Structured dictionary with original text, cleaned text, detected terms, and stats.
        """
        valid_modes = ["mask", "replace", "remove"]
        if mode not in valid_modes:
            mode = "mask"

        if text is None:
            text = ""

        original_text = text
        char_count_orig = len(original_text)
        word_count_orig = len(original_text.split()) if original_text.strip() else 0

        if not original_text.strip() or not self.terms:
            return {
                "original_text": original_text,
                "cleaned_text": original_text,
                "detected_matches": [],
                "flagged_terms": [],
                "match_count": 0,
                "unique_terms_count": 0,
                "is_moderated": False,
                "original_char_count": char_count_orig,
                "cleaned_char_count": char_count_orig,
                "original_word_count": word_count_orig,
                "cleaned_word_count": word_count_orig,
                "replacement_mode": mode
            }

        compiled_re, term_map = self.build_composite_regex()

        detected_matches = []
        # Find all match positions
        for m in compiled_re.finditer(original_text):
            matched_group = m.lastgroup
            term_key = term_map.get(matched_group, m.group(0).lower())
            detected_matches.append({
                "term": term_key,
                "matched_text": m.group(0),
                "start": m.start(),
                "end": m.end()
            })

        # Apply replacement
        def replace_callback(match: re.Match) -> str:
            raw_matched = match.group(0)
            if mode == "mask":
                # Mask each non-whitespace char with asterisk, keeping spaces
                return "".join("*" if not c.isspace() else c for c in raw_matched)
            elif mode == "replace":
                return "[REMOVED]"
            elif mode == "remove":
                return ""
            return raw_matched

        cleaned_text = compiled_re.sub(replace_callback, original_text)

        # In 'remove' mode, normalize extraneous double spaces left behind by deletions
        if mode == "remove":
            # Replace multiple spaces with a single space, but preserve newlines
            cleaned_text = re.sub(r"[ \t]{2,}", " ", cleaned_text)
            # Remove spaces immediately preceding punctuation e.g. "That was ." -> "That was."
            cleaned_text = re.sub(r"\s+([.,!?;:])", r"\1", cleaned_text)
            cleaned_text = cleaned_text.strip()

        char_count_clean = len(cleaned_text)
        word_count_clean = len(cleaned_text.split()) if cleaned_text.strip() else 0
        unique_flagged = sorted(list(set(m["term"] for m in detected_matches)))

        return {
            "original_text": original_text,
            "cleaned_text": cleaned_text,
            "detected_matches": detected_matches,
            "flagged_terms": unique_flagged,
            "match_count": len(detected_matches),
            "unique_terms_count": len(unique_flagged),
            "is_moderated": len(detected_matches) > 0,
            "original_char_count": char_count_orig,
            "cleaned_char_count": char_count_clean,
            "original_word_count": word_count_orig,
            "cleaned_word_count": word_count_clean,
            "replacement_mode": mode
        }
