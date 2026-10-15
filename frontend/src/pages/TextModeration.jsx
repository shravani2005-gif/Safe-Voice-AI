import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Check, 
  Copy, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  Sliders, 
  FileText,
  CheckCircle2
} from 'lucide-react';
import { moderateText } from '../services/api';

const SAMPLE_PROMPTS = [
  {
    label: "Test A: Neutral Sentence",
    text: "This social media application is really helpful and well engineered.",
    mode: "mask"
  },
  {
    label: "Test B: Single Bad Term",
    text: "That was a really stupid idea and everyone knows it.",
    mode: "mask"
  },
  {
    label: "Test C: Multi-Word Phrase",
    text: "Please do not post this bad comment or spread hate speech online.",
    mode: "mask"
  },
  {
    label: "Test D: Boundary False-Positive Check",
    text: "Eating a dumpling while studying idiomatic expressions in class.",
    mode: "mask"
  },
  {
    label: "Test E: Mixed Case & Punctuation",
    text: "You are an IDIOT! Shut UP, this is pure RubBiSh...",
    mode: "replace"
  }
];

export function TextModeration({ onAddHistory }) {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('mask');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await moderateText(inputText, mode);
      setResult(data);
      if (onAddHistory) {
        onAddHistory({
          type: 'text',
          timestamp: new Date().toLocaleTimeString(),
          original: inputText,
          cleaned: data.cleaned_text,
          flagged: data.flagged_terms,
          match_count: data.match_count,
          mode: mode
        });
      }
    } catch (err) {
      setError(err.message || 'Error communicating with backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.cleaned_text) {
      navigator.clipboard.writeText(result.cleaned_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  const renderHighlightedOriginal = () => {
    if (!result || !result.detected_matches || result.detected_matches.length === 0) {
      return result?.original_text;
    }

    // Sort matches by start ascending
    const matches = [...result.detected_matches].sort((a, b) => a.start - b.start);
    const elements = [];
    let lastIndex = 0;

    matches.forEach((m, idx) => {
      if (m.start > lastIndex) {
        elements.push(result.original_text.substring(lastIndex, m.start));
      }
      elements.push(
        <mark key={idx} className="highlight-bad" title={`Flagged Dictionary Term: "${m.term}"`}>
          {m.matched_text}
        </mark>
      );
      lastIndex = m.end;
    });

    if (lastIndex < result.original_text.length) {
      elements.push(result.original_text.substring(lastIndex));
    }

    return elements;
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <FileText className="brand-logo-icon" size={28} /> Social Media Text Moderation
        </h1>
        <p className="page-description">
          Analyze comments, reviews, or chat posts. Detect inappropriate terms using safe word-boundary matching and choose your preferred replacement mode.
        </p>
      </div>

      {/* Preset Test Case Buttons */}
      <div className="card-light-green" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
          <Sparkles size={16} color="#15803d" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            College Demo Test Cases:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setInputText(sample.text);
                setMode(sample.mode);
                setResult(null);
                setError(null);
              }}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box and Configuration */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="text-input">
            Enter or Paste Text:
          </label>
          <textarea
            id="text-input"
            className="textarea-input"
            placeholder="e.g. you are stupid and this is a bad comment..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Replacement Mode Selection */}
        <div className="form-group">
          <label className="form-label">Select Moderation Mode:</label>
          <div className="mode-selector">
            <button
              type="button"
              className={`mode-chip ${mode === 'mask' ? 'active' : ''}`}
              onClick={() => setMode('mask')}
            >
              <span>Asterisk Masking</span>
              <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '0.1rem 0.35rem', borderRadius: 4 }}>
                ******
              </code>
            </button>

            <button
              type="button"
              className={`mode-chip ${mode === 'replace' ? 'active' : ''}`}
              onClick={() => setMode('replace')}
            >
              <span>Placeholder Replacement</span>
              <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '0.1rem 0.35rem', borderRadius: 4 }}>
                [REMOVED]
              </code>
            </button>

            <button
              type="button"
              className={`mode-chip ${mode === 'remove' ? 'active' : ''}`}
              onClick={() => setMode('remove')}
            >
              <span>Complete Removal</span>
              <code style={{ fontSize: '0.8rem', background: '#e2e8f0', padding: '0.1rem 0.35rem', borderRadius: 4 }}>
                (deleted)
              </code>
            </button>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#b91c1c', marginBottom: '1.25rem' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={loading}
          >
            <RotateCcw size={16} /> Clear
          </button>
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="card" style={{ borderColor: result.is_moderated ? '#fde047' : '#86efac' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {result.is_moderated ? (
                  <>
                    <ShieldAlert size={22} color="#eab308" /> Moderation Required
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={22} color="#16a34a" /> Clean – No Configured Inappropriate Terms
                  </>
                )}
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
                Mode: <strong>{result.replacement_mode.toUpperCase()}</strong> | Characters: {result.original_char_count} &rarr; {result.cleaned_char_count}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className={`badge ${result.match_count > 0 ? 'badge-danger' : 'badge-green'}`}>
                {result.match_count} Total Matches
              </span>
              <span className="badge badge-muted">
                {result.unique_terms_count} Unique Flagged Terms
              </span>
            </div>
          </div>

          {/* Flagged Terms Badges */}
          {result.flagged_terms && result.flagged_terms.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginRight: '0.5rem' }}>
                Flagged Dictionary Terms:
              </span>
              <div style={{ display: 'inline-flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {result.flagged_terms.map((term, i) => (
                  <span key={i} className="badge badge-danger">
                    "{term}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Side by side comparison */}
          <div className="comparison-grid">
            <div className="comparison-box">
              <div className="comparison-box-header">
                <span>Original Text ({result.original_char_count} chars, {result.original_word_count} words)</span>
                <span className="badge badge-muted">Input</span>
              </div>
              <div className="comparison-box-body">
                {renderHighlightedOriginal()}
              </div>
            </div>

            <div className="comparison-box">
              <div className="comparison-box-header">
                <span>Moderated Cleaned Text ({result.cleaned_char_count} chars, {result.cleaned_word_count} words)</span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCopy}
                  title="Copy moderated text"
                >
                  {copied ? <><Check size={14} color="#16a34a" /> Copied!</> : <><Copy size={14} /> Copy</>}
                </button>
              </div>
              <div className="comparison-box-body" style={{ background: '#fcfdfd' }}>
                {result.is_moderated ? (
                  <span className="highlight-cleaned">{result.cleaned_text}</span>
                ) : (
                  result.cleaned_text
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
