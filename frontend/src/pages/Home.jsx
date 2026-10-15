import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Mic, 
  UploadCloud, 
  BookOpen, 
  Settings, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { getStats, getHealth, resetStats } from '../services/api';

export function Home({ onNavigate }) {
  const [stats, setStats] = useState({
    total_words_processed: 0,
    total_flagged_words: 0,
    total_submissions: 0,
    total_characters_processed: 0
  });
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsData, healthData] = await Promise.all([
        getStats().catch(() => ({ total_words_processed: 0, total_flagged_words: 0, total_submissions: 0, total_characters_processed: 0 })),
        getHealth().catch(() => null)
      ]);
      setStats(statsData);
      setHealth(healthData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReset = async () => {
    if (window.confirm('Reset current session statistics to zero?')) {
      try {
        await resetStats();
        await fetchDashboardData();
      } catch (err) {
        console.error('Reset failed', err);
      }
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="card-accent-green" style={{ marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#dcfce7', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '700', color: '#166534', marginBottom: '1rem' }}>
            <Sparkles size={16} /> B.Tech Information Science Engineering Prototype
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '1rem' }}>
            SafeVoice AI
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            NLP-Based Inappropriate Language Detection & Removal from Social Media Text and Voice Recognition. 
            An educational demonstration of word-boundary regex engines, Web Speech API, and content moderation pipelines.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('moderate')}>
              <MessageSquare size={18} /> Moderate Social Media Text
            </button>
            <button className="btn btn-outline-green" onClick={() => onNavigate('voice')}>
              <Mic size={18} /> Test Voice Recognition
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('learn')}>
              <BookOpen size={18} /> Learn NLP Preprocessing
            </button>
          </div>
        </div>
      </div>

      {/* Backend Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: 10, 
            height: 10, 
            borderRadius: '50%', 
            background: health?.status === 'healthy' ? '#22c55e' : '#ef4444',
            boxShadow: health?.status === 'healthy' ? '0 0 8px #22c55e' : 'none'
          }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>
            Backend API: {health?.status === 'healthy' ? `Online (Flask v1.0.0, ${health.dictionary_term_count} active dictionary terms)` : 'Connecting...'}
          </span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleReset} title="Reset session counters">
          <RotateCcw size={14} /> Reset Session Counters
        </button>
      </div>

      {/* Live Session Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <MessageSquare size={24} />
          </div>
          <div>
            <div className="stat-label">Words Processed</div>
            <div className="stat-value">{stats.total_words_processed.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef2f2', color: '#b91c1c' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-label">Flagged Bad Words</div>
            <div className="stat-value" style={{ color: '#b91c1c' }}>{stats.total_flagged_words.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#ecfdf5', color: '#047857' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-label">Submissions Moderated</div>
            <div className="stat-value">{stats.total_submissions.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Activity size={24} />
          </div>
          <div>
            <div className="stat-label">Characters Scanned</div>
            <div className="stat-value">{stats.total_characters_processed.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
        Application Modules
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('moderate')}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <MessageSquare size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Text Moderation</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
            Paste social media comments. Test boundary-aware masking, replacement, and deletion with side-by-side highlighting.
          </p>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('voice')}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Mic size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Voice Recognition</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
            Speak directly into your microphone. Transcribe live audio into text using Web Speech API and filter offensive terms.
          </p>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('upload')}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <UploadCloud size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Audio File Upload</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
            Upload recorded WAV speech files. Transcribe on the backend using Python SpeechRecognition and filter results.
          </p>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('dictionary')}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Settings size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Dictionary Management</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
            Configure custom words and multi-word phrases stored in local JSON. Add, delete, and test entries safely.
          </p>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('learn')}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <BookOpen size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>Learn NLP & Speech</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
            Educational guide to tokenization, normalization, regex boundaries, acoustic models, and moderation limits.
          </p>
        </div>

        <div className="card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('about')}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>About SafeVoice AI</h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
            Academic project scope, system architecture, methodology, test cases, and viva presentation materials.
          </p>
        </div>
      </div>
    </div>
  );
}
