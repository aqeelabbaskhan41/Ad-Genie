import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPaperPlane,
  FaUpload,
  FaTimes,
  FaSpinner,
  FaChevronDown,
  FaBrain,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBars,
  FaHistory,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaShareAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";

function ChatbotPage() {
  const navigate = useNavigate();

  const primaryColor = "#5bf0a5";
  const bgColor = "#000";
  const cardBg = "#111";
  const borderColor = "#222";
  const textPrimary = "#fff";
  const mutedTextColor = "#888";
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = API_BASE.replace('/api', '');

  /* ------------------ STATE ------------------ */
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Describe your ad idea or upload an image. I'll generate ads for you.",
      isUser: false,
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  const [selectedModel, setSelectedModel] = useState({ id: "default", name: "AdGenie" });
  const [availableModels, setAvailableModels] = useState([{ id: "default", name: "AdGenie" }]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sessionId, setSessionId] = useState(localStorage.getItem('adgenie_sessionId') || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [currentSessionTitle, setCurrentSessionTitle] = useState("New Chat");
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { name: "User" };
  });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  /* ------------------ REFS ------------------ */
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  /* ------------------ HELPERS ------------------ */
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [copiedId, setCopiedId] = useState(null);

  const MarkdownComponents = {
    p: ({ children }) => <div className="markdown-paragraph">{children}</div>,
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeValue = String(children).replace(/\n$/, "");
      const language = match ? match[1] : "text";

      return !inline ? (
        <div className="relative group my-4 rounded-lg overflow-hidden border border-white/10 bg-[#0d0d0d]">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
            <span className="text-xs font-mono text-white/50">{language}</span>
            <button
              onClick={() => copyToClipboard(codeValue, node.position.start.offset)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              {copiedId === node.position.start.offset ? (
                <>
                  <Check size={12} className="text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              backgroundColor: "transparent",
            }}
            {...props}
          >
            {codeValue}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
  };
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchSessions = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/chatbot/sessions?sessionId=${sessionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) {
            handleAuthError();
            return;
        }
        const data = await response.json();
        if (data.success) {
            setSessions(data.sessions);
        }
    } catch (error) {
        console.error("Failed to fetch sessions", error);
    }
  };

  const handleAuthError = () => {
    alert("Your session has expired. Please login again.");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const deleteSession = async (sid) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/chatbot/session/${sid}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            if (sid === sessionId) {
                startNewChat();
            }
            fetchSessions();
        }
    } catch (error) {
        console.error("Failed to delete session", error);
    }
    setShowDeleteModal(false);
    setActiveSessionId(null);
  };

  const toggleShare = async (sid, currentPublic) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/chatbot/session/${sid}/share`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            setIsPublic(data.isPublic);
            const link = `${window.location.origin}/share/${sid}`;
            setShareLink(link);
            fetchSessions();
        }
    } catch (error) {
        console.error("Failed to toggle share", error);
    }
  };

  const handleShareClick = (session, e) => {
    e.stopPropagation();
    setActiveSessionId(session.sessionId);
    setIsPublic(session.isPublic);
    setShareLink(`${window.location.origin}/share/${session.sessionId}`);
    setShowShareModal(true);
  };

  const handleDeleteClick = (sid, e) => {
    e.stopPropagation();
    setActiveSessionId(sid);
    setShowDeleteModal(true);
  };

  const loadSession = async (sid) => {
    if (sid === sessionId) return;
    setSessionId(sid);
    localStorage.setItem('adgenie_sessionId', sid);
    setIsLoading(true); // Show loader while switching
    // History fetch will be triggered by the sessionId change in useEffect or manually
  };

  const startNewChat = () => {
    const newSid = `session_${Date.now()}`;
    setSessionId(newSid);
    localStorage.setItem('adgenie_sessionId', newSid);
    setMessages([{
        id: Date.now(),
        text: "Describe your ad idea or upload an image. I'll generate ads for you.",
        isUser: false,
        type: "text",
    }]);
    setCurrentSessionTitle("New Chat");
  };

  useEffect(() => {
    fetchSessions();
  }, [sessionId]);

  useEffect(() => {
    const fetchHistory = async () => {
        if (!sessionId) return;
        setIsLoading(true);
        try {
            let url = `http://localhost:5000/api/chatbot/history?sessionId=${sessionId}`;
            const token = localStorage.getItem('token');
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                handleAuthError();
                return;
            }

            const data = await response.json();

            if (data.success && data.messages) {
                if (data.title) setCurrentSessionTitle(data.title);

                // Map DB messages to UI format
                const formattedMessages = data.messages.map((msg, index) => {
                    if (msg.role === 'user') {
                        return { id: index, isUser: true, type: 'text', text: msg.content };
                    } else {
                        if (msg.type === 'text') {
                            return { id: index, isUser: false, type: 'text', text: msg.content };
                        } else if (msg.type === 'image') {
                           return {
                               id: index,
                               isUser: false,
                               type: 'ads_generated',
                               text: msg.content,
                               generatedAds: [
                                   {
                                       id: `${index}-img`,
                                       url: `http://localhost:5000${msg.imageUrl}`,
                                       prompt: msg.content,
                                       platform: 'AdGenie',
                                       likes: 0,
                                       engagement: "0% CTR",
                                       isGeneratedAd: true
                                   }
                               ]
                           };
                        }
                        return null;
                    }
                }).filter(Boolean);
                
                if (formattedMessages.length > 0) {
                   setMessages(formattedMessages);
                } else {
                   setMessages([{
                       id: Date.now(),
                       text: "Describe your ad idea or upload an image. I'll generate ads for you.",
                       isUser: false,
                       type: "text",
                   }]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchHistory();
  }, [sessionId]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5000/api/models", {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            handleAuthError();
            return;
        }

        const data = await response.json();
        if (data.success) {
          setAvailableModels([{ id: "default", name: "AdGenie" }, ...data.models]);
        }
      } catch (error) {
        console.error("Failed to fetch models", error);
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [inputText]);

  /* ------------------ DELETE MODEL ------------------ */
  const handleDeleteModel = async (modelId, e) => {
    e.stopPropagation();
    
    if (modelId === "default") return; 
    
    if (!window.confirm("Are you sure you want to delete this model configuration?")) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/models/${modelId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success) {
            setAvailableModels(prev => prev.filter(model => model.id !== modelId));
            if (selectedModel.id === modelId) {
                setSelectedModel({ id: "default", name: "AdGenie" });
            }
        } else {
            alert(data.message || "Failed to delete model");
        }
    } catch (error) {
        console.error("Failed to delete model", error);
        alert("An error occurred while deleting the model.");
    }
  };

  /* ------------------ IMAGE UPLOAD ------------------ */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(file);
      setUploadedImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  /* ------------------ SEND MESSAGE ------------------ */
  const handleSendMessage = async () => {
    if (!inputText.trim() && !uploadedImagePreview) return;

    const currentPrompt = inputText;
    const userMessage = {
      id: Date.now(),
      isUser: true,
      type: uploadedImagePreview ? "image_text" : "text",
      text: currentPrompt,
      imageUrl: uploadedImagePreview || null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInputText("");
    setUploadedImage(null);
    setUploadedImagePreview(null);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5000/api/chatbot/chat", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                message: currentPrompt,
                sessionId: sessionId,
                modelId: selectedModel.id
            })
        });

        if (!response.ok) throw new Error("Failed to communicate with assistant");

        // Create a placeholder for the bot message
        const botMsgId = Date.now() + 1;
        const botMsg = { id: botMsgId, text: "", isUser: false, type: 'text' };
        setMessages((prev) => [...prev, botMsg]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop(); // Keep partial line in buffer

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const chunk = JSON.parse(line);
                    
                    if (chunk.type === 'text_chunk') {
                        setMessages((prev) => prev.map(m => 
                            m.id === botMsgId ? { ...m, text: m.text + chunk.content } : m
                        ));
                    } else if (chunk.type === 'final_result') {
                        setMessages((prev) => prev.map(m => 
                            m.id === botMsgId ? { 
                                ...m, 
                                text: chunk.text,
                                type: chunk.resultType === 'image' ? 'ads_generated' : 'text',
                                isGeneratedAd: chunk.resultType === 'image' && !!chunk.generatedImage,
                                generatedAds: (chunk.resultType === 'image' && chunk.generatedImage) ? [
                                    {
                                        id: chunk.generatedImage._id || Date.now(),
                                        url: `http://localhost:5000${chunk.generatedImage.imageUrl}`,
                                        prompt: chunk.generatedImage.prompt,
                                        platform: 'AdGenie',
                                        likes: 0,
                                        engagement: "0% CTR",
                                        isGeneratedAd: true
                                    }
                                ] : null
                            } : m
                        ));
                    }
                } catch (e) {
                    console.error("Error parsing stream chunk:", e);
                }
            }
        }

        // Refresh sessions list to get updated titles
        fetchSessions();

    } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now() + 2,
                text: "Sorry, I encountered an error talking to the assistant. Please ensure the backend is running.",
                isUser: false,
                type: 'text'
            },
        ]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditImage = (imageData) => {
    navigate("/editor", {
      state: {
        image: imageData.url || imageData.imageUrl,
        prompt: imageData.text || imageData.prompt || "",
        metadata: {
          platform: imageData.platform,
          likes: imageData.likes,
          engagement: imageData.engagement,
          isGeneratedAd: imageData.isGeneratedAd,
        },
      },
    });
  };

  const canSend = inputText.trim() || uploadedImagePreview;

  return (
    <div style={{ height: "calc(100vh - 115px)", backgroundColor: bgColor, color: textPrimary }} className="flex overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`} style={{ height: "100%" }}>
        <div className="p-4 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 font-bold text-lg">
              <FaBrain style={{ color: primaryColor }} />
              <span>AdGenie 3.1</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              title="Close sidebar"
            >
              <LuPanelLeftClose size={20} />
            </button>
          </div>

          <button 
            onClick={startNewChat}
            className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-dashed hover:bg-white/5 transition-all text-sm mb-6"
            style={{ borderColor: primaryColor + "40", color: primaryColor }}
            title="New Chat"
          >
            <FaPlus size={14} />
          </button>

          <div className="flex-1 overflow-y-auto messages-scroll-area -mx-2 px-2">
            <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-3 px-2">History</h3>
            <div className="space-y-1">
              {sessions.length === 0 ? (
                <div className="px-2 text-xs text-white/20 italic">No history yet</div>
              ) : (
                sessions.map((s) => (
                  <div 
                    key={s.sessionId}
                    onClick={() => loadSession(s.sessionId)}
                    className={`session-item px-3 py-2.5 rounded-lg text-xs truncate flex items-center gap-2 group relative ${s.sessionId === sessionId ? 'active' : ''}`}
                  >
                    <FaHistory size={10} className={s.sessionId === sessionId ? 'text-[#5bf0a5]' : 'text-white/30'} />
                    <span className="truncate flex-1">{s.title || "Untitled Chat"}</span>
                    
                    <div className="flex items-center gap-1 opacity-100 group-hover:opacity-100 transition-opacity">
                      <button 
                         onClick={(e) => handleShareClick(s, e)}
                         className="p-1.5 hover:bg-white/10 rounded-md transition-all text-white/40 hover:text-[#5bf0a5]"
                         title="Share"
                      >
                         <FaShareAlt size={10} />
                      </button>
                      <button 
                         onClick={(e) => handleDeleteClick(s.sessionId, e)}
                         className="p-1.5 hover:bg-white/10 rounded-md transition-all text-white/40 hover:text-red-400"
                         title="Delete"
                      >
                         <FaTrash size={10} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t" style={{ borderColor: "#222" }}>
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5bf0a5] to-[#2ecc71] flex items-center justify-center text-black font-bold text-xs">
                {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{userData.name || "User"}</div>
                <div className="text-[10px] text-white/30 truncate">Elite Member</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header/Top Bar */}
        <header className="h-14 border-b flex items-center justify-between px-4" style={{ borderColor: "#111" }}>
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                title="Open sidebar"
              >
                <LuPanelLeftOpen size={20} />
              </button>
            )}
            <div className="flex flex-col">
              <span className="text-xs font-semibold truncate max-w-[150px] sm:max-w-xs">{currentSessionTitle}</span>
              <span className="text-[10px] text-white/30">AdGenie 3.1</span>
            </div>
          </div>
        </header>
      {/* Add custom scrollbar styles */}
      <style>{`
        /* Custom scrollbar for textarea only */
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: ${primaryColor}80;
          border-radius: 3px;
        }
        
        textarea::-webkit-scrollbar-thumb:hover {
          background: ${primaryColor};
        }
        
        /* For Firefox */
        textarea {
          scrollbar-width: thin;
          scrollbar-color: ${primaryColor}80 #1a1a1a;
        }
        
        /* For the messages scroll area */
        .messages-scroll-area::-webkit-scrollbar {
          width: 4px;
        }
        
        .messages-scroll-area::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .messages-scroll-area::-webkit-scrollbar-thumb {
          background: ${borderColor};
          border-radius: 2px;
        }
        
        .messages-scroll-area::-webkit-scrollbar-thumb:hover {
          background: ${primaryColor}80;
        }

        /* Mobile optimizations */
          .mobile-p-2 {
            padding: 8px !important;
          }
        }

        /* Markdown Styles */
        .markdown-content .markdown-paragraph {
          margin-bottom: 0.5rem;
        }
        .markdown-content .markdown-paragraph:last-child {
          margin-bottom: 0;
        }
        .markdown-content ul, .markdown-content ol {
          margin-left: 1.25rem;
          margin-bottom: 0.5rem;
          list-style-position: outside;
        }
        .markdown-content ul {
          list-style-type: disc;
        }
        .markdown-content ol {
          list-style-type: decimal;
        }
        .markdown-content li {
          margin-bottom: 0.25rem;
        }
        .markdown-content strong {
          font-weight: 700;
          color: inherit;
        }
        .markdown-content code {
          background-color: rgba(255,255,255,0.1);
          padding: 0.1rem 0.3rem;
          border-radius: 4px;
          font-family: monospace;
        }

        /* Sidebar Styles */
        .sidebar {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 260px;
          flex-shrink: 0;
          height: 100vh;
          background: #050505;
          border-right: 1px solid ${borderColor};
          display: flex;
          flex-direction: column;
          z-index: 40;
        }
        .sidebar.collapsed {
          width: 0;
          overflow: hidden;
          border-right-width: 0;
        }
        .sidebar-overlay {
          display: none;
        }
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
          }
          .sidebar.collapsed {
            transform: translateX(-100%);
            width: 260px;
          }
          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(2px);
            z-index: 35;
          }
        }
        .session-item {
          transition: background 0.2s;
          cursor: pointer;
        }
        .session-item:hover {
          background: #1a1a1a;
        }
        .session-item.active {
          background: #1a1a1a;
          border-left: 2px solid ${primaryColor};
        }
      `}</style>

        <div className="flex-1 flex flex-col w-full px-2 sm:px-3 md:px-4 py-2 sm:py-3 gap-2 sm:gap-3 overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col rounded-xl md:rounded-2xl border overflow-hidden" style={{ backgroundColor: cardBg, borderColor }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 messages-scroll-area">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full min-h-[200px]" style={{ color: mutedTextColor }}>
                <div className="text-center px-4">
                  <div className="text-lg mb-2">👋 Welcome to AdGenie!</div>
                  <p className="text-sm">Describe your ad idea or upload an image to get started.</p>
                </div>
              </div>
            )}
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl max-w-[90%] sm:max-w-[85%] ${m.isUser ? "rounded-br-none" : "rounded-bl-none"}`}
                  style={{ backgroundColor: m.isUser ? primaryColor : "#222", color: m.isUser ? "#000" : textPrimary }}
                >
                  <div className="markdown-content text-sm sm:text-base">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                  {m.imageUrl && !m.isGeneratedAd && (
                    <img src={m.imageUrl} alt="Uploaded" className="mt-2 rounded-lg max-h-48 sm:max-h-60 w-auto max-w-full" />
                  )}
                  {m.generatedAds && (
                    <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
                      {m.generatedAds.map((ad) => (
                        <motion.div key={ad.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="cursor-pointer group" onClick={() => handleEditImage(ad)}>
                          <div className="rounded-lg overflow-hidden border transition-all group-hover:border-gray-500" style={{ borderColor }}>
                            <div className="relative">
                              <img src={ad.url} className="w-full h-auto object-contain bg-black/50" style={{ maxHeight: '500px' }} alt="Generated ad" />
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button className="p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white border border-white/30 transition-colors shadow-lg" title="Edit Image">
                                  <FaEdit size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="p-2 sm:p-3 bg-[#0f0f0f]">
                              <div className="flex justify-between items-center mb-1 sm:mb-2">
                                <span className="text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded" style={{ backgroundColor: primaryColor + "20", color: primaryColor }}>
                                  {isMobile ? ad.platform.substring(0, 3) : ad.platform}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm line-clamp-2" style={{ color: textPrimary }}>{ad.prompt}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm" style={{ color: mutedTextColor }}>
                <FaSpinner className="animate-spin" /> 
                <span className="text-sm">Generating...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar - Responsive */}
          <div className="border-t p-2 sm:p-3 flex flex-col gap-2" style={{ borderColor }}>
            {/* Image Preview - Mobile friendly */}
            {uploadedImagePreview && (
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "#1a1a1a" }}>
                <img 
                  src={uploadedImagePreview} 
                  alt="Preview" 
                  className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-lg cursor-pointer border flex-shrink-0" 
                  style={{ borderColor }} 
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm truncate block" style={{ color: textPrimary }}>
                    {uploadedImage?.name ? (uploadedImage.name.length > 20 ? uploadedImage.name.substring(0, 20) + "..." : uploadedImage.name) : "Image to send"}
                  </span>
                  <span className="text-xs" style={{ color: mutedTextColor }}>Ready to send</span>
                </div>
                <button 
                  onClick={() => { setUploadedImage(null); setUploadedImagePreview(null); }} 
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-[#222] transition-colors"
                >
                  <FaTimes size={14} className="sm:size-16" style={{ color: mutedTextColor }} />
                </button>
              </div>
            )}

            {/* Input Controls - Responsive layout */}
            <div className={`flex gap-2 ${isMobile ? 'mobile-flex-col' : 'items-center'}`}>
              {/* Left side controls - Mobile becomes first row */}
              <div className={`flex gap-2 ${isMobile ? 'w-full justify-between mobile-mb-2' : ''}`}>
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current.click()}
                  className={`rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity ${isMobile ? 'w-10 h-10' : 'w-10 h-10 sm:w-11 sm:h-11'}`}
                  style={{ backgroundColor: "#222" }}
                  title="Upload Image"
                >
                  <FaUpload size={isMobile ? 14 : 16} style={{ color: textPrimary }} />
                </button>
                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileUpload} />

                {/* Model Selector - Responsive */}
                <div className={`relative ${isMobile ? 'flex-1' : ''}`} ref={dropdownRef}>
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className={`flex items-center gap-1.5 sm:gap-2 rounded-lg hover:opacity-90 transition-opacity ${isMobile ? 'h-10 px-2 w-full' : 'h-10 sm:h-11 px-2 sm:px-3'}`}
                    style={{ backgroundColor: "#1a1a1a", borderColor, borderWidth: "1px" }}
                  >
                    <FaBrain size={isMobile ? 12 : 14} style={{ color: "#fff" }} />
                    <span style={{ color: primaryColor, fontSize: isMobile ? "12px" : "14px" }} className="truncate">
                      {isMobile && selectedModel.name.length > 10 ? selectedModel.name.substring(0, 8) + "..." : selectedModel.name}
                    </span>
                    <FaChevronDown size={isMobile ? 8 : 10} style={{ color: mutedTextColor }} />
                  </button>

                  {showModelDropdown && (
                    <div 
                      className={`absolute ${isMobile ? 'bottom-full mb-1 left-0 right-0' : 'bottom-full mb-2 left-0'} bg-[#111] border rounded-xl z-30 shadow-lg`}
                      style={{ borderColor, width: isMobile ? '100%' : '240px' }}
                    >
                      {/* Default model always first */}
                      <button
                        key="default"
                        onClick={() => {
                          setSelectedModel(availableModels[0]);
                          setShowModelDropdown(false);
                        }}
                        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[#222] text-sm transition-colors border-b"
                        style={{ borderColor }}
                      >
                        <div className="flex items-center gap-2">
                          <FaBrain size={12} style={{ color: primaryColor }} />
                          <span>AdGenie</span>
                        </div>
                        {selectedModel.id === "default" && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                        )}
                      </button>

                      {/* Custom models */}
                      {availableModels.filter(model => model.id !== "default").map((model) => (
                        <div key={model.id} className="group relative">
                          <div
                            onClick={() => {
                              setSelectedModel(model);
                              setShowModelDropdown(false);
                            }}
                            className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[#222] text-sm transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span style={{ color: mutedTextColor }}>🔧</span>
                              <span className="truncate">{model.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedModel.id === model.id && (
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                              )}
                              <button
                                onClick={(e) => handleDeleteModel(model.id, e)}
                                className="p-1 rounded hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete model"
                              >
                                <FaTrash size={10} style={{ color: "#ef4444" }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Model Button */}
                      <button
                        onClick={() => {
                          setShowModelDropdown(false);
                          navigate("/add-model");
                        }}
                        className="w-full px-3 py-2.5 flex items-center gap-2 text-sm hover:bg-[#222] transition-colors border-t"
                        style={{ borderColor, color: primaryColor }}
                      >
                        <FaPlus size={10} /> Add Model
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Textarea and Send Button - Mobile becomes second row */}
              <div className={`flex gap-2 ${isMobile ? 'w-full' : 'flex-1'}`}>
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={isMobile ? "Describe ad idea…" : "Describe your ad idea…"}
                  rows={1}
                  className={`bg-[#1a1a1a] border rounded-xl px-3 sm:px-4 py-2 sm:py-3 resize-none transition-all focus:outline-none ${isMobile ? 'text-sm flex-1' : 'flex-1'}`}
                  style={{ 
                    borderColor: inputText.trim() ? primaryColor + "40" : (uploadedImagePreview ? primaryColor + "40" : borderColor), 
                    color: textPrimary, 
                    minHeight: isMobile ? "40px" : "44px", 
                    maxHeight: "100px",
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    boxShadow: inputText.trim() ? `0 0 0 1px ${primaryColor}40` : 'none'
                  }}
                />

                {/* Send Button */}
                <button
                  disabled={!canSend}
                  onClick={handleSendMessage}
                  className={`rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 flex-shrink-0 ${isMobile ? 'w-10 h-10' : 'w-10 h-10 sm:w-12 sm:h-12'}`}
                  style={{ 
                    backgroundColor: primaryColor, 
                    color: "#000",
                    opacity: canSend ? 1 : 0.4,
                    cursor: canSend ? "pointer" : "not-allowed"
                  }}
                  title="Send message"
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" size={isMobile ? 14 : 16} />
                  ) : (
                    <FaPaperPlane size={isMobile ? 14 : 16} />
                  )}
                </button>
              </div>
            </div>

            {/* Helper text - Always visible at bottom */}
            <div className="text-[10px] text-center mt-1" style={{ color: mutedTextColor }}>
              Press Enter to send • Shift + Enter for new line
            </div>
          </div>
        </div>

        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-sm p-6 shadow-2xl overflow-hidden relative">
            <h3 className="text-lg font-bold mb-2">Delete Chat?</h3>
            <p className="text-sm text-white/50 mb-6">This action cannot be undone. All messages in this session will be permanently deleted.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#333] hover:bg-white/5 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => deleteSession(activeSessionId)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 transition-all text-sm font-medium text-white shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-[#222] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white"
            >
              <FaTimes size={16} />
            </button>
            
            <h3 className="text-lg font-bold mb-2">Share Chat</h3>
            <p className="text-sm text-white/50 mb-6">Grateful for this chat? Share it with your friends or colleagues.</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <div className="text-sm font-semibold">Public Sharing</div>
                  <div className="text-[11px] text-white/40">Toggle to make this chat viewable via link</div>
                </div>
                <button 
                  onClick={() => toggleShare(activeSessionId, isPublic)}
                  className={`w-11 h-6 rounded-full transition-all relative ${isPublic ? 'bg-[#5bf0a5]' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isPublic ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {isPublic && (
                <div className="space-y-2">
                  <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1">Share Link</div>
                  <div className="flex gap-2">
                    <input 
                      readOnly 
                      value={shareLink}
                      className="flex-1 bg-black border border-[#222] rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink);
                        setCopiedShareLink(true);
                        setTimeout(() => setCopiedShareLink(false), 2000);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#5bf0a5] text-black text-xs font-bold hover:scale-105 transition-all flex items-center gap-2"
                    >
                      {copiedShareLink ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotPage;