import os
import tempfile
import json
import pytest
from moderation import ModerationEngine

@pytest.fixture
def temp_engine():
    """Provides a fresh ModerationEngine with a temporary dictionary file."""
    temp_dict = tempfile.NamedTemporaryFile(mode="w+", suffix=".json", delete=False)
    initial_data = {
        "terms": ["dumb", "fool", "idiot", "stupid", "toxic", "bad comment"]
    }
    json.dump(initial_data, temp_dict)
    temp_dict.close()

    engine = ModerationEngine(dict_path=temp_dict.name)
    yield engine

    if os.path.exists(temp_dict.name):
        os.remove(temp_dict.name)

def test_1_normal_text_without_configured_terms(temp_engine):
    """Test 1: Normal clean text with no bad words."""
    result = temp_engine.moderate("This application is useful and educational.", mode="mask")
    assert result["match_count"] == 0
    assert result["is_moderated"] is False
    assert result["cleaned_text"] == "This application is useful and educational."
    assert result["flagged_terms"] == []

def test_2_text_containing_configured_term(temp_engine):
    """Test 2: Text containing a configured bad term."""
    result = temp_engine.moderate("That was a stupid mistake.", mode="mask")
    assert result["match_count"] == 1
    assert result["is_moderated"] is True
    assert "stupid" in result["flagged_terms"]
    assert "******" in result["cleaned_text"]

def test_3_case_insensitive_matching(temp_engine):
    """Test 3: Case-insensitive detection (UPPERCASE, TitleCase, mixed)."""
    result = temp_engine.moderate("You are STUPID and a FoOl!", mode="mask")
    assert result["match_count"] == 2
    assert "stupid" in result["flagged_terms"]
    assert "fool" in result["flagged_terms"]
    assert "STUPID" not in result["cleaned_text"]
    assert "FoOl" not in result["cleaned_text"]

def test_4_multi_word_phrase_matching(temp_engine):
    """Test 4: Multi-word phrase matching with flexible whitespace."""
    result = temp_engine.moderate("This is a bad   comment on this post.", mode="mask")
    assert result["match_count"] == 1
    assert "bad comment" in result["flagged_terms"]
    assert "***   *******" in result["cleaned_text"]

def test_5_word_boundary_behavior(temp_engine):
    """Test 5: Substring false-positive prevention (word boundaries)."""
    # 'dumb' should not match inside 'dumpling', 'idiot' inside 'idiomatic'
    text = "Eating a dumpling while studying idiomatic expressions."
    result = temp_engine.moderate(text, mode="mask")
    assert result["match_count"] == 0
    assert result["cleaned_text"] == text

def test_6_multiple_occurrences(temp_engine):
    """Test 6: Multiple occurrences of the same and different terms."""
    text = "stupid idea, stupid plan, very toxic vibe."
    result = temp_engine.moderate(text, mode="mask")
    assert result["match_count"] == 3
    assert set(result["flagged_terms"]) == {"stupid", "toxic"}
    assert result["unique_terms_count"] == 2

def test_7_masking_mode(temp_engine):
    """Test 7: Masking mode with asterisks preserves sentence length & punctuation."""
    text = "That was stupid!"
    result = temp_engine.moderate(text, mode="mask")
    assert result["cleaned_text"] == "That was ******!"
    assert result["cleaned_char_count"] == len(text)

def test_8_replacement_mode(temp_engine):
    """Test 8: Replacement mode with [REMOVED]."""
    text = "That was stupid!"
    result = temp_engine.moderate(text, mode="replace")
    assert result["cleaned_text"] == "That was [REMOVED]!"

def test_9_removal_mode(temp_engine):
    """Test 9: Removal mode deletes term and cleans whitespace gracefully."""
    text = "That was stupid."
    result = temp_engine.moderate(text, mode="remove")
    assert result["cleaned_text"] == "That was."

def test_10_empty_input(temp_engine):
    """Test 10: Empty string and whitespace-only string."""
    result_empty = temp_engine.moderate("", mode="mask")
    assert result_empty["match_count"] == 0
    assert result_empty["cleaned_text"] == ""

    result_spaces = temp_engine.moderate("   ", mode="mask")
    assert result_spaces["match_count"] == 0
    assert result_spaces["cleaned_text"] == "   "

def test_11_invalid_replacement_mode(temp_engine):
    """Test 11: Invalid mode gracefully defaults to mask mode."""
    result = temp_engine.moderate("You are an idiot.", mode="unknown_mode")
    assert result["replacement_mode"] == "mask"
    assert "*****" in result["cleaned_text"]

def test_12_unicode_input(temp_engine):
    """Test 12: Unicode text and accented characters handling."""
    text = "Café au lait with a stupid comment 🚀 and emoji!"
    result = temp_engine.moderate(text, mode="mask")
    assert result["match_count"] == 1
    assert "Café" in result["cleaned_text"]
    assert "🚀" in result["cleaned_text"]
    assert "******" in result["cleaned_text"]

def test_13_dictionary_duplicate_handling(temp_engine):
    """Test 13: Dictionary rejects duplicate entries."""
    success, msg = temp_engine.add_term("stupid")
    assert success is False
    assert "already exists" in msg

def test_14_special_characters_in_dictionary(temp_engine):
    """Test 14: Special regex characters in dictionary entries are safely escaped."""
    success, msg = temp_engine.add_term("c++*bad")
    assert success is True
    # Test matching text with this term
    result = temp_engine.moderate("I dislike c++*bad code.", mode="mask")
    assert result["match_count"] == 1
    assert "c++*bad" in result["flagged_terms"]
