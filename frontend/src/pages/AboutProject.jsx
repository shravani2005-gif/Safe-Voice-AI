import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  FileCode2, 
  Award,
  Globe,
  Database
} from 'lucide-react';

export function AboutProject() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <ShieldCheck className="brand-logo-icon" size={28} /> About SafeVoice AI
        </h1>
        <p className="page-description">
          Capstone Academic Project for B.Tech Information Science Engineering (ISE) in Deep Learning & Natural Language Processing.
        </p>
      </div>

      {/* Project Metadata Banner */}
      <div className="card-accent-green" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Academic Degree</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>B.Tech ISE</div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Specialization Subject</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Deep Learning & NLP</div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Architecture Model</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Client-Server REST + Web Speech</div>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>License & Prototype</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Educational Open Source</div>
          </div>
        </div>
      </div>

      {/* Problem Statement & Objectives */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            Problem Statement
          </h2>
          <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.92rem' }}>
            Social media platforms, collaborative forums, and live voice chats are inundated with toxic, offensive, and harassing language. 
            Traditional naive filtering often causes high false-positive censorship (blocking words like <em>dumpling</em> or <em>class</em>) or relies on costly proprietary cloud APIs with privacy risks.
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            Proposed Solution
          </h2>
          <p style={{ color: '#334155', lineHeight: 1.6, fontSize: '0.92rem' }}>
            SafeVoice AI delivers an end-to-end, multi-modal content moderation solution featuring:
            word-boundary regex parsing, multi-word phrase matching, configurable local JSON dictionaries, and real-time speech-to-text integration for voice and audio streams.
          </p>
        </div>
      </div>

      {/* System Architecture */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          System Architecture & Pipeline Flow
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Layer 1</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Input Ingestion</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Text inputs, live microphone audio (Web Speech API), or WAV file uploads.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Layer 2</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Speech to Text</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Acoustic feature extraction & language decoding converts audio into text.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Layer 3</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>NLP Normalization</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Unicode normalization, case-folding, whitespace trimming, and tokenization.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Layer 4</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Boundary Matcher</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Compiled composite regex evaluates word boundaries (<code>\b</code>) and multi-word phrases.
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Layer 5</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Moderation Filter</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Replaces, masks with asterisks, or removes terms while keeping sentence structure.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
          Technology Stack
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d', marginBottom: '0.4rem' }}>Frontend Interface</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>React 19, Vite, Vanilla CSS Design System, Lucide Icons</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d', marginBottom: '0.4rem' }}>Backend Server</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>Python 3.13, Flask 3.1, Flask-CORS, REST API</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d', marginBottom: '0.4rem' }}>NLP Engine</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>Boundary-aware Regular Expressions, Safe Escaping, Unicode support</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d', marginBottom: '0.4rem' }}>Speech Recognition</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>Browser Web Speech API + Python SpeechRecognition</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d', marginBottom: '0.4rem' }}>Automated Testing</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>Pytest (19 comprehensive unit & integration tests)</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#15803d', marginBottom: '0.4rem' }}>Configuration Storage</h4>
            <p style={{ fontSize: '0.85rem', color: '#475569' }}>Local JSON (<code>dictionary.json</code>) with in-memory session stats</p>
          </div>
        </div>
      </div>
    </div>
  );
}
