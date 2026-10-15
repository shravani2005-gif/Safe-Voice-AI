# SafeVoice AI: Academic Project Presentation (9 Slides)

**Course:** B.Tech Information Science & Engineering (ISE)  
**Subject:** Deep Learning & Natural Language Processing  
**Project Title:** SafeVoice AI – NLP-Based Bad Word Detection and Removal from Social Media Text and Voice Recognition  

---

## Slide 1: Title & Overview
### SafeVoice AI: Automated Multi-Modal Content Moderation System
- **Domain:** Artificial Intelligence & Natural Language Processing
- **Focus:** Social Media Comment Filtering & Spoken Audio Moderation
- **Key Architecture:** Boundary-Aware Regex NLP Engine + Web Speech API + Flask & React
- **Project Type:** Educational Capstone Prototype

> **Speaker Notes:**  
> "Good morning, respected professors and evaluators. Today, I am presenting SafeVoice AI, an NLP-based bad word detection and removal system designed for social media comments and spoken audio recognition. In our increasingly interconnected digital ecosystem, automated moderation is essential for ensuring online safety, respectful discourse, and community well-being. Our project demonstrates how foundational NLP algorithms and modern speech-to-text engines unite in an end-to-end working application."

---

## Slide 2: Introduction to Natural Language Processing (NLP)
- **Definition:** The computational subfield of AI enabling systems to parse, comprehend, and generate natural human languages.
- **Core Building Blocks:**
  - **Tokenization:** Segmenting continuous sentences into discrete words or symbols.
  - **Normalization:** Case-folding (`lower()`), whitespace cleaning, and Unicode alignment.
  - **Pattern Matching:** Translating semantic policies into computational search rules.
- **Significance in Deep Learning:** NLP serves as the bridge between raw, unstructured digital text and structured machine intelligence.

> **Speaker Notes:**  
> "Natural Language Processing enables machines to break down unstructured human communication into machine-interpretable components. In our project, preprocessing is step zero: before any classification or filtering can take place, the text must be tokenized, normalized, and cleaned to ensure consistent evaluation."

---

## Slide 3: NLP and Content Moderation
- **The Challenge:** Millions of user-generated posts, comments, and voice chats are generated every minute across social media platforms.
- **The Hazards:** Cyberbullying, harassment, toxic discourse, and hate speech.
- **The Dilemma: The Scunthorpe Problem (False Positives)**
  - Naive substring filters flag benign words (e.g., blocking 'dumpling' because it contains 'dumb', or 'class' because of 'ass').
- **The Goal:** Build an intelligent, boundary-aware filter that eliminates false positives while neutralizing genuine toxicity.

> **Speaker Notes:**  
> "Content moderation isn't just about matching characters; it is about linguistic precision. Many early platforms relied on naive substring matching, which led to the famous Scunthorpe problem—censorious false positives that ruined user experience. SafeVoice AI directly addresses this problem through word-boundary regex mechanics."

---

## Slide 4: Proposed System Workflow & Architecture
- **Ingestion:** Raw social media text input or live microphone speech audio stream.
- **Transcription (Voice Mode):** Converts acoustic signals into textual transcript via Web Speech API / SpeechRecognition.
- **Preprocessing:** Case folding, Unicode normalization, whitespace trimming.
- **Composite Regex Compilation:** Dynamic assembly of dictionary terms using word boundaries (`\b`), safe character escaping, and multi-word phrase lookarounds.
- **Moderation Engine:** Executes chosen transformation:
  1. Asterisk Masking (`******`)
  2. Placeholder Replacement (`[REMOVED]`)
  3. Clean Deletion
- **Output:** Live side-by-side comparative visualization with highlighted matches and audit analytics.

> **Speaker Notes:**  
> "This slide illustrates the complete data flow. Whether the user provides typed text or speaks into a microphone, the input is transformed into normalized text tokens. It then passes through our compiled regex engine, which replaces detected inappropriate words according to the user's preferred masking mode, displaying both versions side by side."

---

## Slide 5: Bad Words Removal from Social Media Text
- **Three Flexible Moderation Modes:**
  1. **Masking:** Preserves exact character count and sentence rhythm using asterisks (`"stupid"` &rarr; `"******"`).
  2. **Replacement:** Inserts explicit audit labels (`"stupid"` &rarr; `"[REMOVED]"`).
  3. **Removal:** Deletes the term and intelligently normalizes leftover spaces and punctuation.
- **Context Preservation:** Punctuations (`!`, `?`, `.`) and non-offending sentence structures remain intact.
- **Session Auditability:** Tracks real-time counts of scanned characters, flagged matches, and unique offending terms.

> **Speaker Notes:**  
> "A key strength of SafeVoice AI is flexibility. Different platforms have different moderation policies: chat games often prefer asterisks to keep text length identical, while corporate forums prefer a clear [REMOVED] tag, and news comment sections prefer clean deletions. Our system supports all three seamlessly."

---

## Slide 6: Text Recognition and Regex Processing
- **Safe Compilation:** Automatically runs `re.escape()` on all dictionary items, preventing Regular Expression Denial of Service (ReDoS) vulnerabilities.
- **Multi-Word Phrase Recognition:**
  - Handles terms like `"bad comment"` or `"hate speech"` even if entered with arbitrary spacing (`"bad    comment"`).
- **Word Boundaries (`\b`):**
  - Pattern: `\b{escaped_term}\b`
  - Guarantees that `"dumpling"` is NOT flagged when `"dumb"` is in the dictionary.
- **Configurable JSON Dictionary:** Allows adding and removing custom terms through a local JSON file (`dictionary.json`) without modifying code.

> **Speaker Notes:**  
> "Here is our core NLP innovation: instead of hardcoding static regexes, our engine dynamically builds a composite regular expression ordered by phrase length. We safely escape metacharacters so users cannot crash the server, and apply word boundary delimiters to ensure zero false positives on subwords."

---

## Slide 7: Voice Recognition (Speech-to-Text Pipeline)
- **Dual Speech Engine Design:**
  - **Microphone Stream:** Real-time Web Speech API with live interim transcript visualization and microphone permission handling.
  - **Audio File Upload:** Backend WAV file transcription powered by Python's `speech_recognition` library.
- **Acoustic Processing Flow:**
  - Sound Wave &rarr; Spectral Feature Extraction (MFCC) &rarr; Acoustic Phoneme Model &rarr; Language Decoding &rarr; NLP Moderation.
- **Transparency & Privacy:** Explicitly communicates to users that browser speech recognition relies on vendor cloud decoders, maintaining transparency.

> **Speaker Notes:**  
> "Voice moderation is crucial for multiplayer gaming and live audio rooms. SafeVoice AI demonstrates voice recognition through two complementary paths: live microphone capture in the browser for instant user feedback, and server-side WAV audio processing for recorded media files."

---

## Slide 8: Tools, Implementation & Demonstration
- **Frontend Stack:** React 19, Vite, Vanilla CSS Design System, Lucide React Icons.
- **Backend Stack:** Python 3.13, Flask 3.1, Flask-CORS, pytest.
- **Testing Verification:** 19 automated pytest scenarios covering all test cases with a 100% pass rate.
- **Live Interactive Features:**
  - Real-time side-by-side comparison with match highlighting.
  - Interactive NLP Tokenizer Sandbox for live student experimentation.
  - Configurable local dictionary manager with instant regex testing sandbox.

> **Speaker Notes:**  
> "Our implementation uses a modern technology stack with React and Flask. We verified the system through 19 comprehensive automated test cases covering edge cases like uppercase words, multi-word phrases, empty inputs, and boundary checks. I will now demonstrate these capabilities in our live application."

---

## Slide 9: Advantages, Limitations & Future Scope
- **Advantages:**
  - Zero third-party API costs or rate limits.
  - Sub-15ms processing latency on local servers.
  - Explainable, deterministic, and privacy-preserving.
  - Elimination of false-positive censorship.
- **Limitations:**
  - Pure dictionary rules cannot determine contextual intent (e.g. medical usage) or detect sarcasm.
- **Future Enhancements:**
  - Integration of a fine-tuned DistilBERT transformer toxicity classifier.
  - Leetspeak obfuscation detection via phonetic Soundex and Levenshtein distance.
- **Conclusion:** SafeVoice AI provides a robust, transparent, and pedagogically sound foundation for modern multi-modal content moderation.

> **Speaker Notes:**  
> "To conclude: SafeVoice AI proves that well-crafted NLP preprocessing and boundary-aware regex can deliver fast, privacy-preserving moderation without expensive external APIs. For future work, we plan to layer a fine-tuned transformer model on top of our rules to detect nuanced sarcasm and context. Thank you, and I look forward to your questions."
