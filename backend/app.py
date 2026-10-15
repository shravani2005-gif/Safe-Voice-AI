import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from moderation import ModerationEngine
from transcription import transcribe_audio_file

app = Flask(__name__)
# Enable CORS for all routes to facilitate seamless Vite dev server connection
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize the moderation engine
engine = ModerationEngine()

# In-memory session statistics (real live statistics)
session_stats = {
    "total_words_processed": 0,
    "total_flagged_words": 0,
    "total_submissions": 0,
    "total_characters_processed": 0
}

MAX_TEXT_LENGTH = 20000  # 20k characters security guard

@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint providing engine status."""
    return jsonify({
        "status": "healthy",
        "service": "SafeVoice AI Backend",
        "version": "1.0.0",
        "dictionary_term_count": len(engine.terms)
    }), 200

@app.route("/api/moderate", methods=["POST"])
def moderate():
    """
    Moderates incoming text using configured rules and dictionary.
    Accepts: { "text": str, "mode": "mask" | "replace" | "remove" }
    """
    if not request.is_json:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    data = request.get_json()
    if data is None or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request payload."}), 400

    text = data.get("text", "")
    mode = data.get("mode", "mask")

    if not isinstance(text, str):
        return jsonify({"error": "'text' field must be a string."}), 400

    if len(text) > MAX_TEXT_LENGTH:
        return jsonify({
            "error": f"Input text exceeds maximum permitted length of {MAX_TEXT_LENGTH} characters."
        }), 400

    # Execute moderation
    result = engine.moderate(text, mode=mode)

    # Update session statistics
    word_count = len(text.split()) if text.strip() else 0
    flagged_count = result.get("match_count", 0)

    session_stats["total_words_processed"] += word_count
    session_stats["total_flagged_words"] += flagged_count
    session_stats["total_submissions"] += 1
    session_stats["total_characters_processed"] += len(text)

    return jsonify(result), 200

@app.route("/api/dictionary", methods=["GET"])
def get_dictionary():
    """Returns all configured bad words and phrases."""
    return jsonify({
        "terms": engine.terms,
        "count": len(engine.terms),
        "description": "SafeVoice AI configured moderation dictionary."
    }), 200

@app.route("/api/dictionary", methods=["POST"])
def add_dictionary_term():
    """Adds a new term or phrase to the dictionary."""
    if not request.is_json:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    data = request.get_json()
    term = data.get("term", "").strip() if data else ""

    if not term:
        return jsonify({"error": "Term cannot be empty."}), 400

    success, message = engine.add_term(term)
    if not success:
        return jsonify({"error": message}), 400

    return jsonify({
        "message": message,
        "term": term.lower(),
        "total_terms": len(engine.terms)
    }), 201

@app.route("/api/dictionary/<path:term>", methods=["DELETE"])
def remove_dictionary_term(term):
    """Removes a configured term from the dictionary."""
    if not term:
        return jsonify({"error": "No term specified to remove."}), 400

    success, message = engine.remove_term(term)
    if not success:
        return jsonify({"error": message}), 404

    return jsonify({
        "message": message,
        "total_terms": len(engine.terms)
    }), 200

@app.route("/api/transcribe", methods=["POST"])
def transcribe_audio():
    """
    Transcribes an uploaded audio file (WAV) using SpeechRecognition.
    Optionally auto-moderates the transcribed text if requested.
    """
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded under field 'audio'."}), 400

    file = request.files["audio"]
    if not file or file.filename == "":
        return jsonify({"error": "No selected audio file."}), 400

    transcription_result = transcribe_audio_file(file)

    if not transcription_result.get("success"):
        return jsonify({
            "success": False,
            "error": transcription_result.get("error", "Transcription failed."),
            "transcript": ""
        }), 400

    transcript = transcription_result.get("transcript", "")
    mode = request.form.get("mode", "mask")
    moderation_result = engine.moderate(transcript, mode=mode)

    # Update session stats for audio transcription submission
    word_count = len(transcript.split()) if transcript.strip() else 0
    session_stats["total_words_processed"] += word_count
    session_stats["total_flagged_words"] += moderation_result.get("match_count", 0)
    session_stats["total_submissions"] += 1
    session_stats["total_characters_processed"] += len(transcript)

    return jsonify({
        "success": True,
        "transcript": transcript,
        "moderation": moderation_result
    }), 200

@app.route("/api/stats", methods=["GET"])
def get_stats():
    """Returns the live session statistics."""
    return jsonify(session_stats), 200

@app.route("/api/reset-stats", methods=["POST"])
def reset_stats():
    """Resets session activity statistics."""
    global session_stats
    session_stats = {
        "total_words_processed": 0,
        "total_flagged_words": 0,
        "total_submissions": 0,
        "total_characters_processed": 0
    }
    return jsonify({"message": "Session statistics reset successfully.", "stats": session_stats}), 200

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
