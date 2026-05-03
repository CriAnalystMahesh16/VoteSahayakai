import { useState, useEffect } from 'react';
import { X, Brain, Trash2 } from 'lucide-react';

export default function MemoryPanel({ open, onClose, userId, lang = 'en' }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  const labels = {
    en: { title: "Ira's Memory", empty: "No memories yet.\nChat more and Ira will remember!", delete: 'Clear all' },
    hi: { title: 'इरा की यादें', empty: 'अभी कोई यादें नहीं।\nबात करें, इरा याद रखेगी!', delete: 'सब हटाएं' },
  }[lang] || {};

  const fetchMemories = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/memory/${userId}`);
      const data = await res.json();
      setMemories(data.memories || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchMemories();
  }, [open, userId]);

  const deleteMemory = async (id) => {
    try {
      await fetch(`/api/memory/${id}`, { method: 'DELETE' });
      setMemories(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {open && <div className="overlay" onClick={onClose} />}
      <div className={`memory-panel ${open ? 'open' : ''}`}>
        <div className="memory-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={18} color="var(--ira-violet)" />
            <span className="memory-title">{labels.title}</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="memory-list">
          {loading ? (
            <div className="memory-empty">Loading...</div>
          ) : memories.length === 0 ? (
            <div className="memory-empty" style={{ whiteSpace: 'pre-line' }}>{labels.empty}</div>
          ) : (
            memories.map(m => (
              <div key={m.id} className="memory-item">
                {m.text}
                <button className="memory-item-delete" onClick={() => deleteMemory(m.id)} title="Delete">
                  <Trash2 size={11} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
