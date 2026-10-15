import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Mic, 
  UploadCloud, 
  Settings, 
  History, 
  BookOpen, 
  Info,
  Menu,
  X
} from 'lucide-react';

import { Home } from './pages/Home';
import { TextModeration } from './pages/TextModeration';
import { VoiceRecognition } from './pages/VoiceRecognition';
import { AudioUpload } from './pages/AudioUpload';
import { DictionaryManagement } from './pages/DictionaryManagement';
import { ResultsHistory } from './pages/ResultsHistory';
import { LearnNLP } from './pages/LearnNLP';
import { AboutProject } from './pages/AboutProject';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [history, setHistory] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const addHistoryItem = (item) => {
    setHistory((prev) => [item, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const navigateTo = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="brand-section" onClick={() => navigateTo('home')}>
          <div className="brand-logo-icon">
            <ShieldCheck size={24} />
          </div>
          <span className="brand-title">SafeVoice AI</span>
          <span className="brand-subtitle">NLP MODERATION</span>
        </div>

        {/* Desktop Nav Links */}
        <ul className="nav-links">
          <li>
            <button
              className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'moderate' ? 'active' : ''}`}
              onClick={() => navigateTo('moderate')}
            >
              <MessageSquare size={16} /> Text Moderation
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'voice' ? 'active' : ''}`}
              onClick={() => navigateTo('voice')}
            >
              <Mic size={16} /> Voice
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => navigateTo('upload')}
            >
              <UploadCloud size={16} /> Audio File
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'dictionary' ? 'active' : ''}`}
              onClick={() => navigateTo('dictionary')}
            >
              <Settings size={16} /> Dictionary
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => navigateTo('history')}
            >
              <History size={16} /> History ({history.length})
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'learn' ? 'active' : ''}`}
              onClick={() => navigateTo('learn')}
            >
              <BookOpen size={16} /> Learn NLP
            </button>
          </li>
          <li>
            <button
              className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => navigateTo('about')}
            >
              <Info size={16} /> About
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content View */}
      <main className="main-content">
        {activeTab === 'home' && <Home onNavigate={navigateTo} />}
        {activeTab === 'moderate' && <TextModeration onAddHistory={addHistoryItem} />}
        {activeTab === 'voice' && <VoiceRecognition onAddHistory={addHistoryItem} />}
        {activeTab === 'upload' && <AudioUpload onAddHistory={addHistoryItem} />}
        {activeTab === 'dictionary' && <DictionaryManagement />}
        {activeTab === 'history' && <ResultsHistory history={history} onClearHistory={clearHistory} />}
        {activeTab === 'learn' && <LearnNLP />}
        {activeTab === 'about' && <AboutProject />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>SafeVoice AI</strong> – Natural Language Processing & Voice Content Moderation System
          </div>
          <div>
            B.Tech Information Science Engineering (Deep Learning Capstone) &bull; Prototype for Demonstration
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
