import { useState, useRef } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

export default function VoiceButton({ text, lang = 'en' }) {
  const [status, setStatus] = useState('idle'); // idle | loading | playing
  const audioRef = useRef(null);

  const handlePlay = async () => {
    if (status === 'playing') {
      audioRef.current?.pause();
      audioRef.current = null;
      setStatus('idle');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang }),
      });

      if (!res.ok) throw new Error('Voice synthesis failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => { setStatus('idle'); URL.revokeObjectURL(url); };
      audio.onerror = () => { setStatus('idle'); URL.revokeObjectURL(url); };

      await audio.play();
      setStatus('playing');
    } catch (err) {
      console.error('Voice error:', err);
      setStatus('idle');
    }
  };

  const label = {
    idle: lang === 'hi' ? 'सुनें' : 'Listen',
    loading: lang === 'hi' ? 'लोड...' : 'Loading...',
    playing: lang === 'hi' ? 'रोकें' : 'Stop',
  }[status];

  return (
    <button
      className={`voice-btn ${status}`}
      onClick={handlePlay}
      title={label}
    >
      {status === 'loading' ? (
        <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />
      ) : status === 'playing' ? (
        <VolumeX size={11} />
      ) : (
        <Volume2 size={11} />
      )}
      {label}
    </button>
  );
}
