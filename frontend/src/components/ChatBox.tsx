import { useState } from "react";
import { chatAPI } from "../api/chatAPI";
import './ChatBox.css';

export const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const response = await chatAPI.ask(question);
      setAnswer(response);
      setQuestion(""); 
    } catch (err) {
      console.error(err);
      setAnswer("Error getting answer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-box-container">
      <div className="chat-input-group">
        <textarea
          placeholder="Type your question about social programs..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="chat-textarea"
          rows={4} // default height
        />
        <button onClick={handleAsk} disabled={loading} className="chat-button">
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>

      {answer && (
        <div className="chat-answer">
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
};
