# SafeVoice AI: Automated Test Suite & Test Execution Log

**Framework:** `pytest 9.1.1` on Python 3.13.5  
**Total Tests:** 19  
**Result:** **19 Passed, 0 Failed (100% Success)**  

---

## Detailed Test Cases Table

| Test ID | Module | Scenario / Description | Test Input | Expected Behavior | Execution Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | `moderation.py` | Normal text without configured terms | `"This application is useful and educational."` | `match_count = 0`, `is_moderated = False`, text unmodified | **PASSED** |
| **TC-02** | `moderation.py` | Text containing single configured term | `"That was a stupid mistake."` | `match_count = 1`, `stupid` flagged, replaced with `******` | **PASSED** |
| **TC-03** | `moderation.py` | Case-insensitive matching (Upper/Mixed) | `"You are STUPID and a FoOl!"` | Both `stupid` and `fool` detected regardless of casing | **PASSED** |
| **TC-04** | `moderation.py` | Multi-word phrase matching with extra spaces | `"This is a bad   comment on this post."` | `bad comment` flagged, replaced with `***   *******` | **PASSED** |
| **TC-05** | `moderation.py` | Word-boundary false-positive prevention | `"Eating a dumpling while studying idiomatic expressions."` | `match_count = 0`, "dumpling" does NOT flag "dumb" | **PASSED** |
| **TC-06** | `moderation.py` | Multiple occurrences of same & different terms | `"stupid idea, stupid plan, very toxic vibe."` | `match_count = 3`, unique flagged = `["stupid", "toxic"]` | **PASSED** |
| **TC-07** | `moderation.py` | Asterisk Masking mode verification | `"That was stupid!"` (mode=`mask`) | Cleaned text: `"That was ******!"`, char count preserved | **PASSED** |
| **TC-08** | `moderation.py` | Placeholder Replacement mode verification | `"That was stupid!"` (mode=`replace`) | Cleaned text: `"That was [REMOVED]!"` | **PASSED** |
| **TC-09** | `moderation.py` | Complete Removal mode verification | `"That was stupid."` (mode=`remove`) | Cleaned text: `"That was."`, spaces normalized | **PASSED** |
| **TC-10** | `moderation.py` | Empty and whitespace-only input | `""` and `"   "` | `match_count = 0`, cleaned text equals input, no errors | **PASSED** |
| **TC-11** | `moderation.py` | Invalid replacement mode fallback | `"You are an idiot."` (mode=`unknown_mode`) | Gracefully falls back to default `mask` mode | **PASSED** |
| **TC-12** | `moderation.py` | Unicode and emoji character handling | `"Café au lait with a stupid comment 🚀 and emoji!"` | Unicode preserved, `stupid` masked to `******` | **PASSED** |
| **TC-13** | `moderation.py` | Dictionary duplicate rejection | Add `"stupid"` when already present | Returns `False`, message specifies duplicate | **PASSED** |
| **TC-14** | `moderation.py` | Special regex character safety | Add `"c++*bad"` to dictionary | `re.escape()` prevents ReDoS, accurately matches literal | **PASSED** |
| **TC-15** | `app.py` | Backend health check endpoint | `GET /api/health` | HTTP 200, returns `{ status: "healthy", version: "1.0.0" }` | **PASSED** |
| **TC-16** | `app.py` | Invalid API request handling | Non-JSON, missing `'text'`, oversized text (>20k chars) | HTTP 400 Bad Request with descriptive JSON error | **PASSED** |
| **TC-17** | `app.py` | Standard API `/api/moderate` endpoint | `POST /api/moderate` with JSON payload | HTTP 200, returns structured moderation object | **PASSED** |
| **TC-18** | `app.py` | Dictionary API CRUD lifecycle | `POST /api/dict`, `GET /api/dict`, `DELETE /api/dict` | HTTP 201 on add, 200 on list, 200 on remove | **PASSED** |
| **TC-19** | `app.py` | Session statistics tracking & reset | `GET /api/stats` and `POST /api/reset-stats` | Correctly increments words and submissions | **PASSED** |

---

## Command to Reproduce Test Suite

```bash
# From project root directory
.\venv\Scripts\pytest -v
```

### Pytest Execution Output
```text
============================= test session starts =============================
platform win32 -- Python 3.13.5, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Users\Yashas\Downloads\NLP
configfile: pytest.ini
testpaths: backend/tests
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
