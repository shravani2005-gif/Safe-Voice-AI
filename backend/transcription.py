import os
import tempfile
import speech_recognition as sr
from typing import Dict, Any

ALLOWED_EXTENSIONS = {".wav"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

def transcribe_audio_file(file_storage) -> Dict[str, Any]:
    """
    Transcribes an uploaded audio file using SpeechRecognition.
    Handles WAV format directly and provides actionable error feedback.
    """
    filename = file_storage.filename or "audio.wav"
    _, ext = os.path.splitext(filename.lower())

    if ext not in ALLOWED_EXTENSIONS:
        return {
            "success": False,
            "transcript": "",
            "error": f"Unsupported audio format '{ext}'. SafeVoice AI currently supports standard uncompressed WAV audio files (.wav). Please convert your audio to 16-bit PCM WAV and try again."
        }

    # Save to a temporary file
    temp_fd, temp_path = tempfile.mkstemp(suffix=".wav")
    os.close(temp_fd)

    try:
        file_storage.save(temp_path)
        file_size = os.path.getsize(temp_path)

        if file_size == 0:
            return {
                "success": False,
                "transcript": "",
                "error": "The uploaded audio file is empty (0 bytes)."
            }

        if file_size > MAX_FILE_SIZE_BYTES:
            return {
                "success": False,
                "transcript": "",
                "error": f"Audio file size exceeds the 10MB limit (uploaded: {file_size / (1024*1024):.2f}MB)."
            }

        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_path) as source:
            # Adjust for ambient noise and record
            recognizer.adjust_for_ambient_noise(source, duration=0.2)
            audio_data = recognizer.record(source)

        # Transcribe using Google Speech Recognition
        text = recognizer.recognize_google(audio_data)

        return {
            "success": True,
            "transcript": text,
            "error": None
        }

    except sr.UnknownValueError:
        return {
            "success": False,
            "transcript": "",
            "error": "Speech was unintelligible or no speech was detected in the audio file."
        }
    except sr.RequestError as e:
        return {
            "success": False,
            "transcript": "",
            "error": f"Transcription service request failed: {e}. Check internet connectivity or try the browser microphone speech recognition."
        }
    except Exception as e:
        return {
            "success": False,
            "transcript": "",
            "error": f"Audio processing error: {str(e)}"
        }
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
