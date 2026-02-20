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
  FaRegThumbsUp,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { motion } from "framer-motion";

function ChatbotPage() {
  const navigate = useNavigate();

  const primaryColor = "#5bf0a5";
  const bgColor = "#000";
  const cardBg = "#111";
  const borderColor = "#222";
  const textPrimary = "#fff";
  const mutedTextColor = "#888";

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

  /* ------------------ REFS ------------------ */
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  /* ------------------ EFFECTS ------------------ */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const storedModels = JSON.parse(localStorage.getItem("customModels") || "[]");
    if (storedModels.length > 0) {
      setAvailableModels([{ id: "default", name: "AdGenie" }, ...storedModels]);
    }
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
  const handleDeleteModel = (modelId, e) => {
    e.stopPropagation();
    
    if (modelId === "default") return; // Can't delete default model
    
    const updatedModels = availableModels.filter(model => model.id !== modelId);
    setAvailableModels(updatedModels);
    
    // Also remove from localStorage if custom
    const customModels = JSON.parse(localStorage.getItem('customModels') || '[]');
    const updatedCustomModels = customModels.filter(model => model.id !== modelId);
    localStorage.setItem('customModels', JSON.stringify(updatedCustomModels));
    
    // If deleted model was selected, switch to default
    if (selectedModel.id === modelId) {
      setSelectedModel(availableModels[0]);
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

    const userMessage = {
      id: Date.now(),
      isUser: true,
      type: uploadedImagePreview ? "image_text" : "text",
      text: inputText,
      imageUrl: uploadedImagePreview || null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Clear input immediately
    const currentPrompt = inputText; // Store for API call
    setInputText("");
    setUploadedImage(null);
    setUploadedImagePreview(null);

      try {
        let generatedAds = [];
        
        // Check if using default/AdGenie model which is now connected to HPC
        if (selectedModel.id === "default") {
          const response = await fetch("http://localhost:5000/api/chatbot/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: currentPrompt })
          });

          const data = await response.json();

          if (data.success) {
            generatedAds = [{
              id: Date.now(),
              url: data.imageUrl,
              prompt: data.prompt || currentPrompt,
              platform: selectedModel.name,
              likes: 0, // Freshly generated
              engagement: "0% CTR", // Freshly generated
              isGeneratedAd: true,
              modelTime: data.modelTime,
              genTime: data.genTime
            }];
          } else {
             throw new Error("Failed to generate image");
          }
        } else {
          // Fallback for custom models (keep mock behavior or TODO)
           generatedAds = [
            {
              id: Date.now(),
              url: uploadedImagePreview || "https://images.unsplash.com/photo-1556656793-08538906a9f8",
              prompt: currentPrompt || "Ad creative",
              platform: selectedModel.name,
              likes: Math.floor(Math.random() * 500) + 100,
              engagement: (Math.random() * 3 + 2).toFixed(1) + "% CTR",
              isGeneratedAd: true,
            }
          ];
        }

        const botMessage = {
          id: Date.now() + 2,
          isUser: false,
          type: "ads_generated",
          text: `I've generated ${generatedAds.length} ad variations for you. Click any image to edit.`,
          generatedAds: generatedAds,
        };

        setMessages((prev) => [...prev, botMessage]);
        setGeneratedImages(prev => [...prev, ...generatedAds]);

      } catch (error) {
        console.error("Generation error:", error);
         const errorMessage = {
          id: Date.now() + 2,
          isUser: false,
          type: "text",
          text: "Sorry, I encountered an error generating your image. Please ensure the backend is running and the HPC model is accessible.",
        };
        setMessages((prev) => [...prev, errorMessage]);
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
    <div style={{ minHeight: "100vh", backgroundColor: bgColor, color: textPrimary }} className="flex flex-col">
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
        @media (max-width: 640px) {
          .mobile-flex-col {
            flex-direction: column !important;
          }
          
          .mobile-w-full {
            width: 100% !important;
          }
          
          .mobile-mt-2 {
            margin-top: 8px !important;
          }
          
          .mobile-text-sm {
            font-size: 14px !important;
          }
          
          .mobile-p-2 {
            padding: 8px !important;
          }
        }
      `}</style>

      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-2 sm:px-3 md:px-4 py-2 sm:py-3 gap-2 sm:gap-3">
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
                  {m.text && <p className="whitespace-pre-wrap break-words text-sm sm:text-base">{m.text}</p>}
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
                                <span className="text-xs flex items-center gap-0.5 sm:gap-1" style={{ color: mutedTextColor }}>
                                  <FaRegThumbsUp size={8} className="sm:size-10" /> <span className="text-xs">{ad.likes}</span>
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
                <span className="text-sm">Generating ads...</span>
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
                          <button
                            onClick={() => {
                              setSelectedModel(model);
                              setShowModelDropdown(false);
                            }}
                            className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-[#222] text-sm transition-colors"
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
                          </button>
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

            {/* Helper text - Mobile hidden */}
            <div className="text-xs text-center hidden sm:block" style={{ color: mutedTextColor }}>
              Press Enter to send • Shift + Enter for new line
            </div>
          </div>
        </div>

        {/* Quick Actions - Mobile optimized */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
          <button 
            className="text-xs px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap"
            style={{ backgroundColor: "#222", color: mutedTextColor }}
            onClick={() => setInputText("Generate ads for a tech startup product")}
          >
            {isMobile ? "Tech" : "Tech Startup"}
          </button>
          <button 
            className="text-xs px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap"
            style={{ backgroundColor: "#222", color: mutedTextColor }}
            onClick={() => setInputText("Create social media ads for fashion brand")}
          >
            {isMobile ? "Fashion" : "Fashion Brand"}
          </button>
          <button 
            className="text-xs px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap"
            style={{ backgroundColor: "#222", color: mutedTextColor }}
            onClick={() => setInputText("Generate food product advertisement")}
          >
            {isMobile ? "Food" : "Food Product"}
          </button>
          <button 
            className="text-xs px-2.5 py-1.5 rounded-lg hover:opacity-80 transition-opacity whitespace-nowrap"
            style={{ backgroundColor: "#222", color: mutedTextColor }}
            onClick={() => setInputText("Create promotional content for mobile app")}
          >
            {isMobile ? "App" : "Mobile App"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;