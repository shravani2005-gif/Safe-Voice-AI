/**
 * SafeVoice AI Frontend API Client
 * Interacts with Flask backend API endpoints.
 */

const API_BASE = '/api';

export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend health check failed');
  return res.json();
}

export async function moderateText(text, mode = 'mask') {
  const res = await fetch(`${API_BASE}/moderate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, mode })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to moderate text');
  }
  return data;
}

export async function getDictionary() {
  const res = await fetch(`${API_BASE}/dictionary`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch dictionary');
  return data;
}

export async function addDictionaryTerm(term) {
  const res = await fetch(`${API_BASE}/dictionary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ term })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add dictionary term');
  return data;
}

export async function removeDictionaryTerm(term) {
  const res = await fetch(`${API_BASE}/dictionary/${encodeURIComponent(term)}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to remove dictionary term');
  return data;
}

export async function transcribeAudio(file, mode = 'mask') {
  const formData = new FormData();
  formData.append('audio', file);
  formData.append('mode', mode);

  const res = await fetch(`${API_BASE}/transcribe`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to transcribe audio');
  return data;
}

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch session statistics');
  return res.json();
}

export async function resetStats() {
  const res = await fetch(`${API_BASE}/reset-stats`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset session statistics');
  return res.json();
}
