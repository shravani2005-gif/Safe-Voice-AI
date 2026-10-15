import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Terminal, 
  Cpu, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Sparkles
} from 'lucide-react';

export function LearnNLP() {
  // Interactive Tokenizer Sandbox state
  const [sandboxInput, setSandboxInput] = useState('NLP and Speech-To-Text can moderate social media posts!');
  const [lowercaseNormalized, setLowercaseNormalized] = useState(true);
  const [removePunctuation, setRemovePunctuation] = useState(false);

  const getTokens = () => {
    let text = sandboxInput;
    if (lowercaseNormalized) text = text.toLowerCase();
    if (removePunctuation) text = text.replace(/[^\w\s]/g, '');
    return text.split(/\s+/).filter(Boolean);
  };

  const tokens = getTokens();

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <BookOpen className="brand-logo-icon" size={28} /> Learn NLP & Speech Moderation Concepts
        </h1>
        <p className="page-description">
          An academic study guide and presentation companion on Natural Language Processing, text preprocessing, regex word boundaries, speech-to-text, and machine learning limits.
        </p>
      </div>

      {/* Interactive Tokenizer Lab */}
      <div className="card-accent-green" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={18} color="#15803d" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Interactive NLP Preprocessing Sandbox
          </h2>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '1.25rem' }}>
          Experiment with how raw strings are segmented into tokens and normalized before pattern matching:
        </p>

        <div className="form-group">
          <input
            type="text"
            className="text-input"
            value={sandboxInput}
            onChange={(e) => setSandboxInput(e.target.value)}
            placeholder="Type any sentence to see tokens..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={lowercaseNormalized}
              onChange={(e) => setLowercaseNormalized(e.target.checked)}
            />
            Case Normalization (lower())
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={removePunctuation}
              onChange={(e) => setRemovePunctuation(e.target.checked)}
            />
            Strip Punctuation regex ([^\w\s])
          </label>
        </div>

        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Generated Tokens ({tokens.length} elements):
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tokens.map((tok, i) => (
              <span key={i} className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem', fontFamily: 'monospace' }}>
                [{i}]: "{tok}"
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Curriculum Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* Module 1 & 2 */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>1. Natural Language Processing & Content Moderation</h3>
          </div>
          <p style={{ color: '#334155', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            <strong>Natural Language Processing (NLP)</strong> is the branch of Artificial Intelligence concerned with enabling computational systems to comprehend, parse, manipulate, and synthesize human languages.
          </p>
          <p style={{ color: '#334155', lineHeight: 1.6 }}>
            <strong>Content Moderation</strong> refers to the automated or human-in-the-loop screening and filtering of user-generated content (UGC) across social networks, gaming chats, and comment sections to enforce platform safety policies against hate speech, harassment, and explicit language.
          </p>
        </div>

        {/* Module 3 & 4 */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>2. Tokenization & Text Normalization</h3>
          </div>
          <p style={{ color: '#334155', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            <strong>Tokenization</strong> breaks contiguous sequences of natural language text into discrete semantic units termed <em>tokens</em> (typically words, subwords, or punctuation symbols).
          </p>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
            Input: "SafeVoice AI is great!" &rarr; Tokens: ["SafeVoice", "AI", "is", "great", "!"]
          </div>
          <p style={{ color: '#334155', lineHeight: 1.6 }}>
            <strong>Normalization</strong> converts surface variants into a canonical representation so comparisons are uniform:
          </p>
          <ul style={{ paddingLeft: '1.5rem', color: '#334155', marginTop: '0.5rem', lineHeight: 1.6 }}>
            <li><strong>Case Folding:</strong> <code>text.lower()</code> maps "STUPID" and "Stupid" to "stupid".</li>
            <li><strong>Whitespace Normalization:</strong> Collapsing arbitrary multi-spaces, tabs, and line breaks into standard single spaces.</li>
            <li><strong>Unicode Normalization:</strong> Ensuring accented characters (e.g., NFC/NFKD) match expected encodings.</li>
          </ul>
        </div>

        {/* Module 5 & 6 */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Terminal size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>3. Regular Expression Word Boundaries (<code>\b</code>) & False-Positive Prevention</h3>
          </div>
          <p style={{ color: '#334155', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            A fundamental flaw in naive substring matching (like Python's <code>if bad_word in text:</code>) is the <strong>Scunthorpe problem</strong> — triggering false positives when a target word appears inside a benign larger word.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: 8, border: '1px solid #fecaca' }}>
              <div style={{ fontWeight: 700, color: '#b91c1c', marginBottom: '0.4rem' }}>❌ Naive Substring Matching</div>
              <p style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>
                Flagging "dumb" inside "dumpling", or "ass" inside "class", "assistant", and "pass". Result: Severe false-positive censorship.
              </p>
            </div>
            <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: 8, border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 700, color: '#15803d', marginBottom: '0.4rem' }}>✅ SafeVoice AI Word Boundary Pattern</div>
              <p style={{ fontSize: '0.85rem', color: '#14532d' }}>
                Pattern: <code>\b{`{re.escape(term)}`}\b</code><br />
                Matches only standalone word tokens, perfectly ignoring "dumpling" while accurately intercepting "You are dumb!".
              </p>
            </div>
          </div>
        </div>

        {/* Module 7, 8, 9 */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>4. Speech Recognition (Speech-to-Text Pipeline)</h3>
          </div>
          <p style={{ color: '#334155', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            Automatic Speech Recognition (ASR) converts raw continuous acoustic waveforms into structured textual transcripts through three primary stages:
          </p>
          <ol style={{ paddingLeft: '1.5rem', color: '#334155', lineHeight: 1.7 }}>
            <li><strong>Feature Extraction:</strong> Audio sampled at 16kHz is converted via Fast Fourier Transform (FFT) into Mel-Frequency Cepstral Coefficients (MFCCs) representing frequency spectra over time frames.</li>
            <li><strong>Acoustic Model:</strong> Deep Neural Networks (CNN/RNN/Conformer) estimate probabilities of distinct phonetic units (phonemes) from the spectral features.</li>
            <li><strong>Language Model:</strong> N-gram or Transformer decoders (e.g. Beam Search) resolve phonetic ambiguities into grammatical vocabulary sequences.</li>
            <li><strong>NLP Post-Processing:</strong> The finalized string is immediately piped into SafeVoice AI's moderation rules to mask inappropriate spoken words.</li>
          </ol>
        </div>

        {/* Module 10: Limitations */}
        <div className="card" style={{ borderColor: '#fde047' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef9c3', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>5. Limitations of Dictionary-Based Moderation</h3>
          </div>
          <p style={{ color: '#334155', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            While dictionary rules are deterministic, interpretable, and computationally instantaneous (O(N) regex search), they have inherent limitations for production platforms:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong>1. Lack of Context:</strong> "Kill the process" in Linux programming vs real-world threats.
            </div>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong>2. Sarcasm & Irony:</strong> Subtle toxic remarks often contain no explicit profanity.
            </div>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong>3. Leetspeak Evasion:</strong> Users substituting glyphs like "b@d", "$tupid", or spacing "s t u p i d".
            </div>
            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <strong>4. Dialect & Vernacular:</strong> Reclaimed terms in African American Vernacular English (AAVE).
            </div>
          </div>
        </div>

        {/* Module 11: Machine Learning Classifier Extension */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lightbulb size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>6. Deep Learning / ML Extension (Toxicity Classifiers)</h3>
          </div>
          <p style={{ color: '#334155', lineHeight: 1.6, marginBottom: '0.75rem' }}>
            To transcend static dictionary lookups, modern systems combine rules with statistical or transformer models (e.g. <em>BERT</em>, <em>DistilBERT</em>, or <em>RoBERTa</em>) trained on publicly licensed corpora such as the <strong>Jigsaw Toxic Comment Classification Challenge</strong> (CC0 public domain).
          </p>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6 }}>
            Pipeline: Raw Text &rarr; Tokenizer &rarr; Embedding Vectors &rarr; Transformer Encoder &rarr; Sigmoid Head &rarr; Toxicity Probability [0.0 to 1.0]
          </div>
        </div>

      </div>
    </div>
  );
}
