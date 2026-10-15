import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileAudio, 
  Play, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { transcribeAudio } from '../services/api';

export function AudioUpload({ onAddHistory }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mode, setMode] = useState('mask');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.wav')) {
      setError('SafeVoice AI backend SpeechRecognition currently requires uncompressed .wav audio files.');
      setSelectedFile(null);
      setAudioUrl(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds 10 MB limit.`);
      setSelectedFile(null);
      setAudioUrl(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    setAudioUrl(URL.createObjectURL(file));
    setResult(null);
  };

  const handleUploadAndTranscribe = async () => {
    if (!selectedFile) {
      setError('Please select a valid WAV audio file first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await transcribeAudio(selectedFile, mode);
      setResult(data);
      if (onAddHistory && data.moderation) {
        onAddHistory({
          type: 'audio-file',
          timestamp: new Date().toLocaleTimeString(),
          original: data.transcript,
          cleaned: data.moderation.cleaned_text,
          flagged: data.moderation.flagged_terms,
          match_count: data.moderation.match_count,
          mode: mode
        });
      }
    } catch (err) {
      setError(err.message || 'Audio file transcription failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <UploadCloud className="brand-logo-icon" size={28} /> Audio File Transcription & Moderation
        </h1>
        <p className="page-description">
          Upload recorded voice notes or audio files (WAV format). The backend extracts audio phonemes, performs speech-to-text conversion, and detects configured bad words.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div 
          style={{
            border: '2px dashed #bbf7d0',
            borderRadius: 12,
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: '#f0fdf4',
            cursor: 'pointer',
            marginBottom: '1.5rem'
          }}
          onClick={() => document.getElementById('audio-file-input').click()}
        >
          <input
            id="audio-file-input"
            type="file"
            accept=".wav"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileAudio size={28} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
            {selectedFile ? selectedFile.name : 'Click to select or drop WAV audio file'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {selectedFile ? `Size: ${(selectedFile.size / 1024).toFixed(1)} KB` : 'Supports standard PCM WAV files up to 10MB'}
          </p>
        </div>

        {audioUrl && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <audio controls src={audioUrl} style={{ width: '100%' }} />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Replacement Mode for Cleaned Output:</label>
          <div className="mode-selector">
            <button
              type="button"
              className={`mode-chip ${mode === 'mask' ? 'active' : ''}`}
              onClick={() => setMode('mask')}
            >
              Asterisk Masking (******)
            </button>
            <button
              type="button"
              className={`mode-chip ${mode === 'replace' ? 'active' : ''}`}
              onClick={() => setMode('replace')}
            >
              Placeholder ([REMOVED])
            </button>
            <button
              type="button"
              className={`mode-chip ${mode === 'remove' ? 'active' : ''}`}
              onClick={() => setMode('remove')}
            >
              Complete Removal
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.85rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#b91c1c', marginBottom: '1.25rem', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <AlertCircle size={18} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>{error}</div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleUploadAndTranscribe}
            disabled={loading || !selectedFile}
          >
            {loading ? 'Transcribing & Analyzing...' : 'Transcribe & Moderate Audio'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {result && result.moderation && (
        <div className="card" style={{ borderColor: result.moderation.is_moderated ? '#fde047' : '#86efac' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {result.moderation.is_moderated ? (
                <>
                  <ShieldAlert size={22} color="#eab308" /> Moderation Required on Uploaded Audio
                </>
              ) : (
                <>
                  <CheckCircle2 size={22} color="#16a34a" /> Clean Audio Transcript
                </>
              )}
            </h2>
            <span className={`badge ${result.moderation.match_count > 0 ? 'badge-danger' : 'badge-green'}`}>
              {result.moderation.match_count} Flagged Matches
            </span>
          </div>

          <div className="comparison-grid">
            <div className="comparison-box">
              <div className="comparison-box-header">
                <span>Recognized Speech Transcript</span>
                <span className="badge badge-muted">Backend STT</span>
              </div>
              <div className="comparison-box-body">
                {result.transcript}
              </div>
            </div>

            <div className="comparison-box">
              <div className="comparison-box-header">
                <span>Cleaned & Moderated Audio Text</span>
                <span className="badge badge-green">{result.moderation.replacement_mode}</span>
              </div>
              <div className="comparison-box-body">
                <span className="highlight-cleaned">{result.moderation.cleaned_text}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
