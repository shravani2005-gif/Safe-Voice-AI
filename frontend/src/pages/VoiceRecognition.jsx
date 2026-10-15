import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Sparkles
} from 'lucide-react';
import { moderateText } from '../services/api';

export function VoiceRecognition({ onAddHistory }) {
  const [isSupported, setIsSupported] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [micStatus, setMicStatus] = useState('Idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [mode, setMode] = useState('mask');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setStatusMessage('Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or the Audio Upload tab.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setMicStatus('Listening...');
      setStatusMessage('Microphone active. Speak naturally into your microphone.');
      setError(null);
    };

    recognition.onresult = (event) => {
      let interim = '';
      let finalStr = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (finalStr) {
        setFinalTranscript((prev) => (prev ? `${prev} ${finalStr.trim()}` : finalStr.trim()));
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition event error:', event.error);
      setIsRecording(false);
      setMicStatus('Error');
      if (event.error === 'not-allowed') {
        setStatusMessage('Microphone access was denied. Please allow microphone permissions in your browser settings.');
      } else if (event.error === 'no-speech') {
        setStatusMessage('No speech was detected. Please verify your microphone and speak again.');
      } else if (event.error === 'audio-capture') {
        setStatusMessage('No microphone was found or microphone is busy.');
      } else {
        setStatusMessage(`Speech recognition encountered an issue: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      setMicStatus('Stopped');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = () => {
    setError(null);
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsRecording(false);
      setMicStatus('Stopped');
    } catch (err) {
      console.error('Error stopping recognition:', err);
    }
  };

  const clearTranscript = () => {
    setFinalTranscript('');
    setInterimTranscript('');
    setResult(null);
    setError(null);
    setStatusMessage('');
  };

  const analyzeTranscript = async () => {
    const textToAnalyze = (finalTranscript + ' ' + interimTranscript).trim();
    if (!textToAnalyze) {
      setError('No speech transcript available to analyze. Please speak first or type a sample.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await moderateText(textToAnalyze, mode);
      setResult(data);
      if (onAddHistory) {
        onAddHistory({
          type: 'voice',
          timestamp: new Date().toLocaleTimeString(),
          original: textToAnalyze,
          cleaned: data.cleaned_text,
          flagged: data.flagged_terms,
          match_count: data.match_count,
          mode: mode
        });
      }
    } catch (err) {
      setError(err.message || 'Error moderating transcript.');
    } finally {
      setLoading(false);
    }
  };

  // Provide college demonstration voice simulation for offline/virtual setups
  const insertDemoVoiceTranscript = (text) => {
    setFinalTranscript(text);
    setInterimTranscript('');
    setResult(null);
    setError(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Mic className="brand-logo-icon" size={28} /> Voice Recognition & Spoken Content Moderation
        </h1>
        <p className="page-description">
          Convert spoken speech into text using the browser Web Speech API, then run the recognized transcript through the SafeVoice AI moderation engine.
        </p>
      </div>

      {/* Browser Support & Cloud Privacy Banner */}
      <div className="card-light-green" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Info size={20} color="#15803d" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
          <div style={{ fontSize: '0.88rem', color: '#166534', lineHeight: 1.5 }}>
            <strong>Speech Recognition Architecture Note:</strong> Modern browser Web Speech API uses vendor-hosted acoustic models (e.g. Google Cloud Speech on Chrome). For 100% offline edge deployments, local engines such as <em>Vosk</em> or <em>Whisper</em> can be integrated as described in the Learn NLP section.
          </div>
        </div>
      </div>

      {!isSupported && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: 12, color: '#b91c1c', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertTriangle size={24} />
          <div>
            <strong>Browser Speech API Not Supported:</strong> {statusMessage}
          </div>
        </div>
      )}

      {/* Mic Controls Card */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div 
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: isRecording ? '#ef4444' : '#f1f5f9',
                color: isRecording ? 'white' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              className={isRecording ? 'mic-recording-pulse' : ''}
            >
              {isRecording ? <Mic size={30} /> : <MicOff size={30} />}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                Status: {micStatus}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {statusMessage || 'Click "Start Recording" and speak into your microphone.'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!isRecording ? (
              <button
                className="btn btn-primary"
                onClick={startListening}
                disabled={!isSupported}
              >
                <Mic size={18} /> Start Recording
              </button>
            ) : (
              <button
                className="btn btn-danger"
                onClick={stopListening}
              >
                <MicOff size={18} /> Stop Recording
              </button>
            )}

            <button
              className="btn btn-secondary"
              onClick={clearTranscript}
            >
              <RotateCcw size={16} /> Clear Transcript
            </button>
          </div>
        </div>

        {/* Demo Fallback for Labs without Physical Microphones */}
        <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Sparkles size={16} color="#64748b" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569' }}>
            Lab Voice Simulation (if microphone unavailable):
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => insertDemoVoiceTranscript("hello everyone, this was a really stupid presentation and toxic remark.")}
          >
            Load Sample Audio Transcript
          </button>
        </div>

        {/* Transcript Box */}
        <div className="form-group">
          <label className="form-label" htmlFor="transcript-area">
            Recognized Speech Transcript:
          </label>
          <div
            id="transcript-area"
            style={{
              minHeight: 110,
              padding: '1rem',
              borderRadius: 10,
              border: '1.5px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#0f172a',
            }}
          >
            {finalTranscript && <span>{finalTranscript} </span>}
            {interimTranscript && (
              <span style={{ color: '#059669', fontStyle: 'italic' }}>
                {interimTranscript} ...
              </span>
            )}
            {!finalTranscript && !interimTranscript && (
              <span style={{ color: '#94a3b8' }}>
                Your transcribed speech will appear here in real-time as you speak...
              </span>
            )}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="form-group">
          <label className="form-label">Replacement Mode for Audio Transcript:</label>
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
          <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#b91c1c', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={analyzeTranscript}
          disabled={loading || (!finalTranscript && !interimTranscript)}
        >
          {loading ? 'Moderating Transcript...' : 'Analyze & Clean Transcript'}
        </button>
      </div>

      {/* Moderation Results Display */}
      {result && (
        <div className="card" style={{ borderColor: result.is_moderated ? '#fde047' : '#86efac' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {result.is_moderated ? (
                  <>
                    <ShieldAlert size={22} color="#eab308" /> Detected {result.match_count} Inappropriate Term(s) in Spoken Audio
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={22} color="#16a34a" /> Clean Audio Transcript – No Offensive Terms Detected
                  </>
                )}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className={`badge ${result.match_count > 0 ? 'badge-danger' : 'badge-green'}`}>
                {result.match_count} Flagged Matches
              </span>
            </div>
          </div>

          <div className="comparison-grid">
            <div className="comparison-box">
              <div className="comparison-box-header">
                <span>Original Speech Transcript</span>
                <span className="badge badge-muted">Audio Input</span>
              </div>
              <div className="comparison-box-body">
                {result.original_text}
              </div>
            </div>

            <div className="comparison-box">
              <div className="comparison-box-header">
                <span>Moderated Speech Transcript</span>
                <span className="badge badge-green">{result.replacement_mode}</span>
              </div>
              <div className="comparison-box-body">
                <span className="highlight-cleaned">{result.cleaned_text}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
