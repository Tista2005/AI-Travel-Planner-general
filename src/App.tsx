import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'ready' | 'error'>('checking');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health');
      if (response.ok) {
        const data = await response.json();
        if (data.api_ready) {
          setBackendStatus('ready');
        } else {
          setBackendStatus('error');
          setError(`Backend configuration issue: ${data.status}`);
        }
      } else {
        setBackendStatus('error');
        setError('Backend server is not responding properly');
      }
    } catch (err) {
      setBackendStatus('error');
      setError('Cannot connect to backend server. Make sure it\'s running on http://localhost:8000');
    }
  };

  const sendToWatson = async (userMessage: string): Promise<string> => {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  };

  const handleSendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    const messageId = Date.now().toString();
    
    // Add user message
    const newUserMessage: Message = {
      id: messageId,
      text: userMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setMessage('');
    setLoading(true);
    setError(null);

    try {
      const botResponse = await sendToWatson(userMessage);
      
      // Add bot response
      const botMessage: Message = {
        id: messageId + '_bot',
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Add error message as bot response
      const errorBotMessage: Message = {
        id: messageId + '_error',
        text: `Error: ${errorMessage}`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen font-sans text-gray-100 bg-gradient-to-br from-[#1a1f24] via-[#12161b] to-black">
      
      {/* Sidebar */}
      <aside className="w-60 bg-[#101418]/80 border-r border-gray-700 flex flex-col justify-between p-5">
        <div>
          <div className="flex items-center mb-5">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-2 rounded-full shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="ml-3 text-lg font-semibold tracking-wide">AI Travel Planner</h1>
          </div>
          <div className={`flex items-center px-2 py-0.5 rounded text-xs ${
            backendStatus==='ready' ? 'bg-green-500/20 text-green-300' :
            backendStatus==='error' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
          }`}>
            <div className={`w-2 h-2 mr-2 rounded-full ${
              backendStatus==='ready' ? 'bg-green-300' :
              backendStatus==='error' ? 'bg-red-300' : 'bg-yellow-300'
            }`} />
            {backendStatus==='ready' ? 'Online' : backendStatus==='error' ? 'Error' : 'Checking'}
          </div>
          <p className="mt-5 text-xs text-gray-400 leading-relaxed">
            Ask about destinations, hotels, flights — powered by IBM Watsonx.
          </p>
        </div>
        <div className="text-xs text-gray-500">
          <p>⚡ <span className="text-cyan-400">IBM Watsonx</span></p>
        </div>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center mt-20 text-gray-500">
              <p className="text-base">Start chatting below!</p>
              <p className="text-xs">Ask your travel questions</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender==='user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md px-4 py-2 rounded-xl text-sm shadow ${
                msg.sender==='user'
                  ? 'bg-gradient-to-br from-cyan-500 to-teal-500 text-white'
                  : 'bg-gray-800 border border-teal-500/20 text-gray-100'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <p className="text-[10px] mt-1 font-mono opacity-60">{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-teal-500/20 px-3 py-1.5 rounded-xl flex items-center space-x-2 text-xs text-gray-300">
                <Loader2 className="w-3 h-3 animate-spin text-cyan-400" /> <span>AI Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error */}
        {error && <div className="p-2 text-center bg-red-800/20 text-xs text-red-300">{error}</div>}

        {/* Input */}
        <div className="p-4 border-t border-gray-700 bg-[#101418]/90 flex space-x-3">
          <textarea
            value={message}
            onChange={e=>setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Enter to send)"
            rows={1}
            className="flex-1 resize-none bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            disabled={loading}
          />
          <button
            // onClick={handleSend}
            disabled={!message.trim() || loading}
            className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 px-4 py-2 rounded-md text-white shadow disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;