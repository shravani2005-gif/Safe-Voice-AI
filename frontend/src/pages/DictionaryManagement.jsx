import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  Info,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { getDictionary, addDictionaryTerm, removeDictionaryTerm } from '../services/api';

export function DictionaryManagement() {
  const [terms, setTerms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Live validator sandbox
  const [testWord, setTestWord] = useState('');
  const [testResult, setTestResult] = useState(null);

  const fetchDictionary = async () => {
    try {
      setLoading(true);
      const data = await getDictionary();
      setTerms(data.terms || []);
    } catch (err) {
      setError(err.message || 'Failed to load dictionary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDictionary();
  }, []);

  const handleAddTerm = async (e) => {
    e.preventDefault();
    const trimmed = newTerm.trim().toLowerCase();
    if (!trimmed) {
      setError('Term or phrase cannot be empty.');
      return;
    }
    if (terms.includes(trimmed)) {
      setError(`Term "${trimmed}" already exists in the dictionary.`);
      return;
    }

    setError(null);
    setActionLoading(true);
    try {
      const res = await addDictionaryTerm(trimmed);
      setMessage(`Added "${res.term}" to local dictionary.`);
      setNewTerm('');
      await fetchDictionary();
      setTimeout(() => setMessage(null), 3500);
    } catch (err) {
      setError(err.message || 'Failed to add term.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveTerm = async (termToRemove) => {
    if (!window.confirm(`Are you sure you want to remove "${termToRemove}" from the dictionary?`)) {
      return;
    }
    setError(null);
    try {
      await removeDictionaryTerm(termToRemove);
      setMessage(`Removed "${termToRemove}" from dictionary.`);
      await fetchDictionary();
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to remove term.');
    }
  };

  const handleTestWord = (e) => {
    const val = e.target.value;
    setTestWord(val);
    if (!val.trim()) {
      setTestResult(null);
      return;
    }
    const lower = val.trim().toLowerCase();
    const isMatched = terms.some(t => {
      // Check full word or phrase match
      const regex = new RegExp(`\\b${t}\\b`, 'i');
      return regex.test(lower);
    });
    setTestResult(isMatched);
  };

  const filteredTerms = terms.filter(t => 
    t.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Settings className="brand-logo-icon" size={28} /> Configurable Bad-Word Dictionary
        </h1>
        <p className="page-description">
          Manage local word and phrase rules stored in <code>dictionary.json</code>. Terms are escaped safely and compiled into boundary-aware regex patterns on the backend.
        </p>
      </div>

      {/* Safety and Educational Notice */}
      <div className="card-light-green" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Info size={20} color="#15803d" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
          <div style={{ fontSize: '0.88rem', color: '#166534', lineHeight: 1.5 }}>
            <strong>Safety & Ethics Standards:</strong> In accordance with educational guidelines, default dictionary terms consist solely of benign demonstration placeholders (e.g. <em>"bad comment"</em>, <em>"toxic"</em>, <em>"nonsense"</em>). Special regex characters like <code>*</code>, <code>+</code>, or <code>?</code> are automatically escaped using <code>re.escape()</code> to prevent Regular Expression Denial of Service (ReDoS).
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Add Term Form */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
            Add Word or Multi-Word Phrase
          </h2>
          <form onSubmit={handleAddTerm}>
            <div className="form-group">
              <label className="form-label" htmlFor="add-term-input">New Inappropriate Term:</label>
              <input
                id="add-term-input"
                type="text"
                className="text-input"
                placeholder="e.g. obnoxious, fake news, silly phrase"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={actionLoading || !newTerm.trim()}
              style={{ width: '100%' }}
            >
              <Plus size={18} /> {actionLoading ? 'Saving...' : 'Add to Dictionary'}
            </button>
          </form>
        </div>

        {/* Live Dictionary Match Validator */}
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>
            Interactive Word-Boundary Tester
          </h2>
          <div className="form-group">
            <label className="form-label" htmlFor="tester-input">Type a word or sentence to test:</label>
            <input
              id="tester-input"
              type="text"
              className="text-input"
              placeholder="e.g. dumpling vs dumb, or toxic comment"
              value={testWord}
              onChange={handleTestWord}
            />
          </div>
          {testResult !== null && (
            <div style={{ 
              padding: '0.65rem 1rem', 
              borderRadius: 8, 
              background: testResult ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${testResult ? '#fecaca' : '#bbf7d0'}`,
              color: testResult ? '#b91c1c' : '#15803d',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {testResult ? (
                <>⚠️ Triggers Dictionary Match!</>
              ) : (
                <>✅ Clean – No boundary match in dictionary</>
              )}
            </div>
          )}
        </div>
      </div>

      {message && (
        <div style={{ padding: '0.75rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, color: '#065f46', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={18} /> {message}
        </div>
      )}

      {error && (
        <div style={{ padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#b91c1c', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Dictionary List & Search */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Configured Terms ({terms.length} Total)
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Stored persistently in <code>backend/dictionary.json</code>
            </p>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              type="text"
              className="text-input"
              placeholder="Search terms..."
              style={{ paddingLeft: '2.2rem', paddingBottom: '0.55rem', paddingTop: '0.55rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading dictionary entries...</p>
        ) : filteredTerms.length === 0 ? (
          <p style={{ color: '#94a3b8', fontStyle: 'italic', padding: '1rem 0' }}>
            No matching terms found.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {filteredTerms.map((term, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.95rem',
                  borderRadius: 8,
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontFamily: 'monospace' }}>#{idx + 1}</span>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.92rem' }}>
                    {term}
                  </span>
                  {term.includes(' ') && (
                    <span className="badge badge-muted" style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                      Phrase
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveTerm(term)}
                  className="btn btn-sm"
                  style={{ background: 'transparent', color: '#94a3b8', padding: '0.2rem' }}
                  title={`Remove "${term}"`}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
