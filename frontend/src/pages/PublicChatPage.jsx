import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBrain, FaChevronLeft } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function PublicChatPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const fetchPublicChat = async () => {
      try {
        const response = await fetch(`${API_BASE}/chatbot/public/${sessionId}`);
        const data = await response.json();
        if (data.success) {
          setChat(data);
        } else {
          setError(data.message || "Public chat not found");
        }
      } catch (err) {
        setError("Failed to load community chat");
      } finally {
        setLoading(false);
      }
    };
    fetchPublicChat();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <FaBrain size={40} className="text-[#5bf0a5]" />
          <p className="text-sm font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <FaBrain size={48} className="text-white/10 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Oops!</h1>
        <p className="text-white/50 mb-8 max-w-sm">{error}</p>
        <button 
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl bg-[#5bf0a5] text-black font-bold hover:scale-105 transition-all text-sm"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#5bf0a5]/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-all"
          >
            <FaChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <FaBrain className="text-[#5bf0a5]" />
            <span className="font-bold tracking-tight">AdGenie <span className="text-[#5bf0a5]">Public</span></span>
          </div>
        </div>
        <div className="hidden sm:block text-xs font-medium text-white/30 truncate max-w-xs">{chat.title}</div>
        <button 
          onClick={() => navigate("/chat")}
          className="text-xs px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-semibold"
        >
          Start Your Own Chat
        </button>
      </header>

      {/* Content */}
      <main className="pt-24 pb-12 px-4 sm:px-8 max-w-4xl mx-auto">
        <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-black mb-4 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                {chat.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-white/30">
                <span>Shared Research</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span>View only mode</span>
            </div>
        </div>

        <div className="space-y-8">
            {chat.messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`max-w-[85%] sm:max-w-3xl rounded-2xl md:rounded-3xl p-4 sm:p-6 shadow-sm border ${
                        msg.role === 'user' 
                        ? 'bg-[#111] border-white/5 rounded-tr-none' 
                        : 'bg-white/[0.03] border-white/5 rounded-tl-none'
                      }`}
                    >
                        <div className="text-[10px] uppercase tracking-widest font-bold mb-3 opacity-30">
                            {msg.role === 'user' ? 'Request' : 'Assistant'}
                        </div>
                        <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-white/10 max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center">
             <p className="text-xs text-white/20 mb-4">AdGenie 3.1 • Powerful AI Advertisement Generator</p>
             <div className="flex justify-center gap-4">
                  <a href="#" className="text-[10px] text-white/10 hover:text-white/30 transition-colors uppercase tracking-widest font-bold">Terms</a>
                  <a href="#" className="text-[10px] text-white/10 hover:text-white/30 transition-colors uppercase tracking-widest font-bold">Privacy</a>
             </div>
        </div>
      </main>
    </div>
  );
}

export default PublicChatPage;
