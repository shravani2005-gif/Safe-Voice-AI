# SafeVoice AI: Comprehensive Viva Voce Questions & Answers

**Target Audience:** B.Tech Information Science & Engineering (ISE) Students  
**Subject:** Deep Learning, Natural Language Processing, and Web Systems  

---

### Q1. What is Natural Language Processing (NLP)?
**Answer:** Natural Language Processing (NLP) is a subfield of Artificial Intelligence and Computational Linguistics focused on giving computers the ability to understand, interpret, manipulate, and generate human language in a meaningful and computationally useful way.

### Q2. What is text preprocessing and why is it essential in NLP?
**Answer:** Text preprocessing involves cleaning, transforming, and standardizing raw, unstructured textual data prior to computational analysis. It removes noise, normalizes variations (such as case and punctuation), and ensures the downstream matching algorithms or neural networks operate on uniform data representations.

### Q3. What is tokenization?
**Answer:** Tokenization is the process of segmenting a continuous stream of text into smaller discrete semantic units called tokens (words, sub-words, or punctuation symbols). In SafeVoice AI, tokenization helps analyze individual words against the moderation dictionary.

### Q4. What is text normalization?
**Answer:** Text normalization converts varied surface representations of equivalent linguistic elements into a canonical form. Examples include case-folding (`"STUPID"` &rarr; `"stupid"`), collapsing erratic whitespace, and normalizing Unicode characters.

### Q5. What is automated content moderation?
**Answer:** Content moderation is the systemized practice of monitoring, screening, and filtering user-generated content (text, audio, images) against community guidelines to detect and restrict harmful discourse such as hate speech, harassment, vulgarity, and toxic comments.

### Q6. How does SafeVoice AI detect inappropriate words?
**Answer:** SafeVoice AI employs a compiled composite regular expression engine. It loads configured terms from a local JSON dictionary, safely escapes regex metacharacters, attaches word boundaries (`\b`), enables case-insensitivity (`re.IGNORECASE`), and matches tokens without causing substring collisions.

### Q7. What are regular expressions, and why are they used here?
**Answer:** Regular expressions (regex) are formal algebraic patterns used for string matching and searching. Regex is used in SafeVoice AI because it executes in linear time $O(N)$ with zero GPU or network latency, providing deterministic and explainable moderation results.

### Q8. Why are word boundaries (`\b`) crucial in content moderation?
**Answer:** Word boundaries prevent the "Scunthorpe problem" (substring false positives). Without word boundaries, searching for `"dumb"` would incorrectly flag the benign word `"dumpling"`, and searching for `"ass"` would censor `"class"`, `"pass"`, or `"assistant"`. Word boundaries ensure only complete, standalone tokens are matched.

### Q9. What is the difference between False Positives and False Negatives?
**Answer:**
- **False Positive (Type I Error):** Censoring benign content mistakenly (e.g., flagging the word "dumpling" because it contains "dumb").
- **False Negative (Type II Error):** Failing to intercept genuinely offensive language (e.g., missing disguised or misspelled vulgarities like `"st*pid"`).

### Q10. What are the three moderation modes in SafeVoice AI?
**Answer:**
1. **Masking (`mask`):** Replaces each non-whitespace character of detected words with asterisks (`******`), preserving sentence length and visual structure.
2. **Replacement (`replace`):** Replaces the target phrase with an explicit placeholder tag (`[REMOVED]`).
3. **Removal (`remove`):** Deletes the detected phrase entirely and normalizes leftover spaces and punctuation.

### Q11. What is Automatic Speech Recognition (ASR) / Speech-to-Text (STT)?
**Answer:** ASR is the technology that processes acoustic sound waves captured by a microphone and translates them into machine-readable text transcripts.

### Q12. How does speech recognition convert acoustic waveforms into text?
**Answer:** 
1. **Feature Extraction:** Audio is converted into spectral features (e.g., Mel-Frequency Cepstral Coefficients / MFCCs).
2. **Acoustic Model:** Maps sound features to discrete phonetic units (phonemes).
3. **Language Model:** Resolves phonemes into the most probable sequence of natural words based on linguistic probability.

### Q13. How does the Voice Recognition module in SafeVoice AI work?
**Answer:** The frontend connects to the browser's native **Web Speech API** (`webkitSpeechRecognition`). When the user speaks, audio frames are streamed to the browser speech engine, which returns real-time interim and final text transcripts. These transcripts are then immediately forwarded to the Flask NLP backend for moderation.

### Q14. What happens when a user uploads an audio file instead of speaking live?
**Answer:** The audio file (WAV) is sent via HTTP multipart POST to `/api/transcribe`. The backend loads the file using Python's `speech_recognition` library, normalizes ambient noise, converts the audio to text, executes the moderation engine, and returns both the raw transcript and cleaned text side by side.

### Q15. What are the primary privacy concerns regarding voice recognition?
**Answer:** In browser Web Speech API implementations (such as Google Chrome), speech audio can be routed to vendor cloud servers for neural decoding. For privacy-sensitive deployments, an on-premise or edge model (such as Vosk or Whisper running locally on the server) must be utilized to guarantee that no audio leaves the local premises.

### Q16. Why does SafeVoice AI use Flask for the backend?
**Answer:** Flask is a lightweight, modular Python WSGI web framework. It provides fast routing, seamless REST API endpoints, simple CORS integration, and effortless integration with Python's native `re`, `json`, and NLP libraries without heavy framework boilerplate.

### Q17. Why is React and Vite chosen for the frontend?
**Answer:** React provides declarative, component-driven UI management with responsive real-time state updates (handling live transcript streams and side-by-side highlighting). Vite delivers instantaneous Hot Module Replacement (HMR) and optimized build times via native ES modules.

### Q18. What is ReDoS (Regular Expression Denial of Service), and how does SafeVoice AI prevent it?
**Answer:** ReDoS occurs when a malicious user injects catastrophic backtracking patterns (e.g., `(a+)+$`) into a regex engine, causing CPU starvation. SafeVoice AI prevents ReDoS by running `re.escape()` on all user-supplied dictionary terms before pattern compilation, ensuring metacharacters are treated purely as literal characters.

### Q19. What are the key limitations of dictionary-based moderation?
**Answer:**
1. **Lack of Context & Intent:** Cannot discern benign usage (e.g., medical anatomy terms) from harassment.
2. **Inability to Detect Sarcasm:** Subtle passive-aggressive insults without explicit slurs bypass the dictionary.
3. **Obfuscation Evasion:** Adversarial spellings (e.g., `b@d`, `d.u.m.b`) evade exact boundary matching.

### Q20. How can this system be enhanced using Deep Learning in the future?
**Answer:** By incorporating a fine-tuned transformer language model (such as BERT or DistilBERT) trained on toxic comment datasets (like Jigsaw). The deep learning model evaluates the semantic embedding of the entire sentence, outputting a continuous toxicity score between 0.0 and 1.0 that captures subtle context, intent, and colloquial slang.
