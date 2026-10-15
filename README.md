# SafeVoice AI: NLP-Based Bad Word Detection and Removal from Social Media Text and Voice Recognition

[![Python Version](https://img.shields.io/badge/python-3.13%2B-blue.svg)](https://www.python.org/)
[![Flask Version](https://img.shields.io/badge/flask-3.1%2B-green.svg)](https://flask.palletsprojects.com/)
[![React Version](https://img.shields.io/badge/react-19-cyan.svg)](https://react.dev/)
[![Pytest Status](https://img.shields.io/badge/pytest-19%20passed%20(100%25)-brightgreen.svg)](https://docs.pytest.org/)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

> **Academic Capstone Project**  
> **Course:** Bachelor of Technology (B.Tech) in Information Science & Engineering (ISE)  
> **Subject:** Deep Learning & Natural Language Processing  
> **Type:** Functional Multi-Modal Prototype  

---

## 1. Abstract & Introduction
**SafeVoice AI** is an automated, privacy-first content moderation application designed to detect and filter inappropriate or toxic language from social media text and spoken audio. 

Unlike naive keyword filters that flag harmless words containing matching substrings (the "Scunthorpe problem", e.g. flagging *"dumpling"* because of *"dumb"*, or *"class"* because of *"ass"*), SafeVoice AI utilizes a boundary-aware regular expression engine with safe metacharacter escaping and flexible multi-word phrase matching. For spoken interactions, the application integrates the browser **Web Speech API** for real-time microphone dictation alongside backend WAV audio file transcription via Python's **SpeechRecognition** engine.

---

## 2. Key Features

1. **Social Media Text Moderation:**
   - Detects configured words and multi-word phrases.
   - Word-boundary aware matching (`\b`) to eliminate substring false positives.
   - Case-insensitive matching with full Unicode and punctuation preservation.
2. **Three Replacement Strategies:**
   - **Asterisk Masking (`mask`):** Replaces non-whitespace characters with asterisks (`"stupid"` &rarr; `"******"`).
   - **Placeholder Replacement (`replace`):** Injects a standardized tag (`"stupid"` &rarr; `"[REMOVED]"`).
   - **Complete Removal (`remove`):** Deletes target terms and normalizes leftover spacing.
3. **Dual-Engine Voice Recognition:**
   - **Microphone Dictation:** Real-time Web Speech API with live interim transcript visualization and mic permission handling.
   - **Audio File Upload:** Backend WAV audio ingestion, ambient noise compensation, and speech-to-text conversion.
4. **Side-by-Side Comparison:**
   - Color-coded highlighting of flagged terms in the original text and modifications in the cleaned text.
   - Character counts, word counts, and match totals.
5. **Configurable Dictionary Management:**
   - Add/remove terms and multi-word phrases saved to `backend/dictionary.json`.
   - Automatic `re.escape()` prevents Regular Expression Denial of Service (ReDoS).
   - Built-in interactive regex boundary tester.
6. **Educational & Audit Tools:**
   - Live session statistics (words processed, flagged terms, submissions).
   - Interactive Tokenizer and Normalization Sandbox for student demonstrations.
   - Session history log with one-click JSON export.

---

## 3. Technology Stack

- **Frontend:** React 19, Vite 8, Vanilla CSS Design System, Lucide React Icons.
- **Backend:** Python 3.13, Flask 3.1, Flask-CORS 6.0, SpeechRecognition 3.17.
- **Testing:** pytest 9.1 (19 automated unit & integration test scenarios).
- **Storage:** Local JSON configuration (`backend/dictionary.json`).

---

## 4. Project Directory Structure

```text
NLP/
├── backend/
│   ├── app.py                 # Flask REST API server
│   ├── moderation.py          # Boundary-aware NLP moderation engine
│   ├── transcription.py       # SpeechRecognition audio file parser
│   ├── dictionary.json        # Configurable dictionary of bad words/phrases
│   ├── requirements.txt       # Python backend dependencies
│   └── tests/
│       ├── test_moderation.py # Unit tests for boundary, case, and modes
│       └── test_api.py        # Integration tests for Flask endpoints
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Dashboard with live session stats
│   │   │   ├── TextModeration.jsx       # Text moderation & test cases
│   │   │   ├── VoiceRecognition.jsx     # Web Speech API microphone dictation
│   │   │   ├── AudioUpload.jsx          # WAV audio file transcription
│   │   │   ├── DictionaryManagement.jsx # Local dictionary CRUD & tester
│   │   │   ├── ResultsHistory.jsx       # Session history audit log
│   │   │   ├── LearnNLP.jsx             # Interactive tokenizer sandbox
│   │   │   └── AboutProject.jsx         # System architecture & metadata
│   │   ├── services/
│   │   │   └── api.js         # Frontend HTTP REST client
│   │   ├── App.jsx            # Main app shell & navigation
│   │   ├── main.jsx           # React DOM root entry
│   │   └── index.css          # Vanilla CSS tokens & styling
│   ├── package.json           # Frontend npm dependencies
│   ├── vite.config.js         # Vite proxy configuration (port 5174 -> 5000)
│   └── index.html             # HTML5 template
├── docs/
│   ├── project_report.md      # Full 20-section academic project report
│   ├── test_cases.md          # 19 automated test scenarios & test logs
│   ├── viva_questions.md      # 20+ comprehensive viva Q&A for B.Tech
│   └── presentation_slides.md # 9-slide college presentation with speaker notes
├── pytest.ini                 # Pytest test discovery config
├── README.md                  # Comprehensive project documentation
└── .gitignore                 # Git ignore rules
```

---

## 5. Setup & Installation Instructions

### Prerequisites
- **Python:** Version 3.10+ (tested on Python 3.13)
- **Node.js:** Version 18+ (tested on Node v24)
- **Browser:** Google Chrome or Microsoft Edge (for Web Speech API support)

---

### Step 1: Clone or Navigate to Project Directory
```powershell
cd c:\Users\Yashas\Downloads\NLP
```

---

### Step 2: Set Up Python Backend Virtual Environment
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r backend\requirements.txt
```

---

### Step 3: Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

---

## 6. How to Run the Application

### Option A: Run Backend Server (Terminal 1)
```powershell
cd c:\Users\Yashas\Downloads\NLP
.\venv\Scripts\python backend\app.py
```
> The Flask API server will start on: **`http://127.0.0.1:5000`**

### Option B: Run Frontend Development Server (Terminal 2)
```powershell
cd c:\Users\Yashas\Downloads\NLP\frontend
npm run dev
```
> The React interface will be accessible at: **`http://localhost:5174`**

---

## 7. Running Automated Tests

SafeVoice AI includes a comprehensive automated test suite covering all 16 prescribed project requirements.

To execute the tests:
```powershell
cd c:\Users\Yashas\Downloads\NLP
.\venv\Scripts\pytest -v
```

### Verified Test Results Summary
```text
collected 19 items

backend/tests/test_api.py::test_15_backend_health_endpoint PASSED        [  5%]
backend/tests/test_api.py::test_16_invalid_api_requests PASSED           [ 10%]
backend/tests/test_api.py::test_api_moderate_endpoint_success PASSED     [ 15%]
backend/tests/test_api.py::test_api_dictionary_lifecycle PASSED          [ 21%]
backend/tests/test_api.py::test_api_stats_lifecycle PASSED               [ 26%]
backend/tests/test_moderation.py::test_1_normal_text_without_configured_terms PASSED [ 31%]
backend/tests/test_moderation.py::test_2_text_containing_configured_term PASSED [ 36%]
backend/tests/test_moderation.py::test_3_case_insensitive_matching PASSED [ 42%]
backend/tests/test_moderation.py::test_4_multi_word_phrase_matching PASSED [ 47%]
backend/tests/test_moderation.py::test_5_word_boundary_behavior PASSED   [ 52%]
backend/tests/test_moderation.py::test_6_multiple_occurrences PASSED     [ 57%]
backend/tests/test_moderation.py::test_7_masking_mode PASSED             [ 63%]
backend/tests/test_moderation.py::test_8_replacement_mode PASSED         [ 68%]
backend/tests/test_moderation.py::test_9_removal_mode PASSED             [ 73%]
backend/tests/test_moderation.py::test_10_empty_input PASSED             [ 78%]
backend/tests/test_moderation.py::test_11_invalid_replacement_mode PASSED [ 84%]
backend/tests/test_moderation.py::test_12_unicode_input PASSED           [ 89%]
backend/tests/test_moderation.py::test_13_dictionary_duplicate_handling PASSED [ 94%]
backend/tests/test_moderation.py::test_14_special_characters_in_dictionary PASSED [100%]

======================== 19 passed, 1 warning in 0.92s ========================
```

---

## 8. Backend API Documentation

### 1. Health Status
- **Endpoint:** `GET /api/health`
- **Response:**
  ```json
  {
    "dictionary_term_count": 10,
    "service": "SafeVoice AI Backend",
    "status": "healthy",
    "version": "1.0.0"
  }
  ```

### 2. Moderate Text
- **Endpoint:** `POST /api/moderate`
- **Request Body:**
  ```json
  {
    "text": "That was a really stupid and toxic remark.",
    "mode": "mask"
  }
  ```
- **Response Body:**
  ```json
  {
    "original_text": "That was a really stupid and toxic remark.",
    "cleaned_text": "That was a really ****** and ***** remark.",
    "detected_matches": [
      { "end": 24, "matched_text": "stupid", "start": 18, "term": "stupid" },
      { "end": 34, "matched_text": "toxic", "start": 29, "term": "toxic" }
    ],
    "flagged_terms": ["stupid", "toxic"],
    "match_count": 2,
    "unique_terms_count": 2,
    "is_moderated": true,
    "original_char_count": 42,
    "cleaned_char_count": 42,
    "original_word_count": 8,
    "cleaned_word_count": 8,
    "replacement_mode": "mask"
  }
  ```

### 3. Manage Dictionary
- **`GET /api/dictionary`**: Returns all active bad-word terms.
- **`POST /api/dictionary`**: Adds a new term (`{ "term": "offensive phrase" }`).
- **`DELETE /api/dictionary/<term>`**: Removes a configured term.

### 4. Transcribe Audio
- **Endpoint:** `POST /api/transcribe` (multipart/form-data)
- **Field:** `audio` (file: .wav format), `mode` ("mask" | "replace" | "remove")
- **Response:** Returns speech transcript and moderated output.

### 5. Session Analytics
- **`GET /api/stats`**: Returns total words processed, flagged words, and submission counts.
- **`POST /api/reset-stats`**: Resets counters to zero.

---

## 9. Faculty Demonstration Script (Step-by-Step)

Follow this 5-minute script when presenting the project to your faculty or evaluator:

1. **Open the Dashboard (`http://localhost:5174`):**
   - Point out the active backend connection indicator (`Flask v1.0.0 Online, 10 active dictionary terms`).
   - Show the session activity statistics cards (Words Processed, Flagged Bad Words, Submissions).
2. **Demonstrate Social Media Text Moderation:**
   - Click on the **Text Moderation** tab.
   - Click on **Test D: Boundary False-Positive Check** (`"Eating a dumpling while studying idiomatic expressions in class."`).
   - Click **Analyze Text**. Explain that despite containing substrings like *"dumb"* and *"idiot"*, zero matches are flagged because of word-boundary regex (`\b`).
   - Click on **Test B: Single Bad Term** (`"That was a stupid idea..."`).
   - Show **Asterisk Masking** (`******`), then switch to **Placeholder Replacement** (`[REMOVED]`) and **Complete Removal** to demonstrate each mode.
3. **Demonstrate Voice Recognition:**
   - Navigate to the **Voice** tab.
   - Click **Start Recording**, speak into the microphone (e.g. *"This is a stupid comment"*), and click **Stop Recording**.
   - Click **Analyze & Clean Transcript** to show spoken speech being moderated.
   - *(If physical microphone is absent in college lab, use the built-in "Load Sample Audio Transcript" simulation button).*
4. **Demonstrate Dictionary Management:**
   - Navigate to the **Dictionary** tab.
   - Add a custom phrase, e.g. `"obnoxious comment"`.
   - Use the **Interactive Word-Boundary Tester** to verify live matches.
5. **Show Educational NLP Sandbox:**
   - Navigate to the **Learn NLP** tab.
   - Type in a custom sentence in the **Tokenizer Sandbox** and toggle Case Normalization and Punctuation Stripping to explain how preprocessing functions.

---

## 10. Security & Privacy Considerations

- **Safe Escaping:** All user-supplied dictionary additions are escaped with `re.escape()` to mitigate Regular Expression Denial of Service (ReDoS).
- **DoS Safeguards:** Payload lengths are restricted to a maximum of 20,000 characters and 10MB audio files.
- **Privacy Transparency:** Browser speech recognition uses native Web Speech API endpoints. For enterprise confidentiality, instructions for offline models (Vosk) are documented in the architecture report.

---

## 11. Academic Evaluation Deliverables

The `docs/` folder contains complete materials for final submission:
- **`docs/project_report.md`**: 20-section academic project report.
- **`docs/test_cases.md`**: 19 automated test cases and execution logs.
- **`docs/viva_questions.md`**: 20+ viva voce Q&A for B.Tech exams.
- **`docs/presentation_slides.md`**: 9-slide presentation with speaker notes.

---

## 12. License
Developed for educational research and academic evaluation under the MIT License.
