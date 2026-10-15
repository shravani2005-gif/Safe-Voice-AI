import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  FileText, 
  Mic, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export function ResultsHistory({ history, onClearHistory }) {
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = history.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `safevoice_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'voice':
        return <Mic size={16} color="#047857" />;
      case 'audio-file':
        return <UploadCloud size={16} color="#0d9488" />;
      default:
        return <FileText size={16} color="#15803d" />;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <History className="brand-logo-icon" size={28} /> Session Moderation History & Audit Log
        </h1>
        <p className="page-description">
          Review all text submissions and speech transcripts processed during this session.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('all')}
            >
              All Records ({history.length})
            </button>
            <button
              className={`btn btn-sm ${filterType === 'text' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('text')}
            >
              Text Submissions
            </button>
            <button
              className={`btn btn-sm ${filterType === 'voice' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('voice')}
            >
              Voice Transcripts
            </button>
            <button
              className={`btn btn-sm ${filterType === 'audio-file' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterType('audio-file')}
            >
              Audio Files
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleExportJSON}
              disabled={history.length === 0}
            >
              <Download size={14} /> Export JSON
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={onClearHistory}
              disabled={history.length === 0}
            >
              <Trash2 size={14} /> Clear History
            </button>
          </div>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <History size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
            No History Records Yet
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Process social media text or spoken audio in the respective modules to view moderation logs here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredHistory.map((item, idx) => (
            <div key={idx} className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {getTypeIcon(item.type)} {item.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {item.timestamp}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`badge ${item.match_count > 0 ? 'badge-danger' : 'badge-green'}`}>
                    {item.match_count} Matches
                  </span>
                  <span className="badge badge-muted">
                    Mode: {item.mode}
                  </span>
                </div>
              </div>

              {item.flagged && item.flagged.length > 0 && (
                <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Terms:</span>
                  {item.flagged.map((f, i) => (
                    <span key={i} className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                      {f}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '0.85rem', borderRadius: 8, fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.2rem' }}>
                    Original Text
                  </strong>
                  <div style={{ color: '#334155' }}>{item.original}</div>
                </div>

                <div>
                  <strong style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.2rem' }}>
                    Cleaned Output
                  </strong>
                  <div style={{ color: '#166534', fontWeight: 500 }}>{item.cleaned}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
