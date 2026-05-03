import VoiceButton from './VoiceButton.jsx';

const emotionEmoji = {
  joy: '✨',
  sadness: '🤍',
  support: '💜',
  playful: '😊',
  neutral: '',
};

const emotionLabel = {
  en: { joy: 'joyful', sadness: 'caring', support: 'supportive', playful: 'playful', neutral: '' },
  hi: { joy: 'खुशी', sadness: 'सहानुभूति', support: 'सहयोगी', playful: 'मजेदार', neutral: '' },
};

export default function Message({ msg, lang = 'en' }) {
  const isIra = msg.role === 'assistant';
  const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const emotion = msg.emotion || 'neutral';

  return (
    <div className={`msg-row ${isIra ? 'ira' : 'user'}`}>
      <div className={`msg-avatar ${isIra ? 'ira-av' : ''}`}>
        {isIra ? '🌸' : '🧑'}
      </div>
      <div>
        <div className={`msg-bubble ${isIra ? 'ira' : 'user'}`}>
          {msg.content}
          {isIra && emotion && emotion !== 'neutral' && (
            <div>
              <span className="emotion-tag">
                {emotionEmoji[emotion]} {emotionLabel[lang][emotion]}
              </span>
            </div>
          )}
          {isIra && (
            <div>
              <VoiceButton text={msg.content} lang={lang} />
            </div>
          )}
        </div>
        <div className="msg-time">{time}</div>
      </div>
    </div>
  );
}
