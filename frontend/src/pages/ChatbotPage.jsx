import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowRight,
  FaImage,
  FaUpload,
  FaTimes,
  FaSpinner,
  FaRegThumbsUp,
} from "react-icons/fa";
import { motion } from "framer-motion";

function ChatbotPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const primaryColor = "#5bf0a5";
  const bgColor = "#000000";
  const cardBg = "#111111";
  const borderColor = "#222222";
  const textPrimary = "#ffffff";
  const mutedTextColor = "#888888";
  
  // Main states
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Describe your ad idea or upload an image. I'll generate professional ads for you.", 
      isUser: false, 
      timestamp: new Date().toISOString(),
      type: "text"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  
  
  // Refs
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check for returned edited image
  useEffect(() => {
    if (location.state?.editedImage && location.state?.originalImage) {
        setGeneratedImages(prev => prev.map(img => 
            img.id === location.state.originalImage.id 
            ? { ...img, url: location.state.editedImage }
            : img
        ));
        
        // Add message
        setMessages(prev => [...prev, {
            id: Date.now(),
            text: "Here is your edited image.",
            isUser: false,
            timestamp: new Date().toISOString(),
            type: "text"
        }]);

        // Clear state so we don't re-process on refresh
        window.history.replaceState({}, document.title)
    }
  }, [location.state]);
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please upload an image file');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }
      
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setUploadedImagePreview(imageUrl);
        
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `Uploaded: ${file.name}`,
          isUser: true,
          timestamp: new Date().toISOString(),
          type: "image_upload",
          imageUrl: imageUrl
        }]);
        
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: "Perfect! Now describe what kind of ad you want me to create.",
            isUser: false,
            timestamp: new Date().toISOString(),
            type: "text"
          }]);
        }, 300);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle send message
  const handleSendMessage = async () => {
    if (!inputText.trim() && !uploadedImage) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toISOString(),
      type: "text"
    };
    
    if (uploadedImagePreview) {
      userMessage.imageUrl = uploadedImagePreview;
      userMessage.type = "image_with_text";
    }
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    
    setTimeout(async () => {
      const mockImages = [
        {
          id: 1,
          url: uploadedImagePreview || "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          prompt: inputText || "Modern tech ad for smartphones",
          platform: "Instagram",
          likes: 128,
          downloads: 45,
          engagement: "4.8% CTR",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          url: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          prompt: inputText || "Fashion e-commerce summer collection",
          platform: "Facebook",
          likes: 89,
          downloads: 32,
          engagement: "3.2x ROAS",
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          prompt: inputText || "Food delivery service promotion",
          platform: "Google Ads",
          likes: 156,
          downloads: 67,
          engagement: "5.2% CTR",
          createdAt: new Date().toISOString()
        }
      ];
      
      setGeneratedImages(mockImages);
      
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        text: "Generated 3 ad variations. Click any image to edit.",
        isUser: false,
        timestamp: new Date().toISOString(),
        type: "text"
      }]);
      
      setIsLoading(false);
    }, 2000);
  };
  
  // Handle image click for editing
  const handleImageEditClick = (image) => {
    navigate('/editor', { state: { image: image.url, originalImage: image } });
  };
  
  // Handle key press for send
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  
  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: bgColor,
      fontFamily: "Inter, sans-serif",
      color: textPrimary
    }}>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Side - Simple Chat Input */}
          <div className="lg:col-span-2">
            <div style={{ 
              backgroundColor: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              {/* Chat Messages */}
              <div className="p-6 h-[400px] overflow-y-auto">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div style={{ 
                      maxWidth: '80%',
                      padding: '12px 16px',
                      borderRadius: '16px',
                      backgroundColor: message.isUser ? primaryColor : '#222222',
                      color: message.isUser ? 'black' : textPrimary
                    }}>
                      {message.type === "text" && (
                        <p>{message.text}</p>
                      )}
                      
                      {message.imageUrl && (
                        <div className="mt-2">
                          <img 
                            src={message.imageUrl} 
                            alt="Uploaded preview" 
                            className="rounded-lg max-w-full max-h-48 object-cover"
                            style={{ border: `1px solid ${borderColor}` }}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div style={{ 
                      padding: '12px 16px',
                      borderRadius: '16px',
                      backgroundColor: '#222222'
                    }}>
                      <div className="flex items-center gap-3">
                        <FaSpinner className="animate-spin" style={{ color: primaryColor }} />
                        <span>Generating ads...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat Input Area */}
<div
  className="border-t px-3 py-2 sm:px-4 sm:py-3"
  style={{ borderColor }}
>
  <div className="flex items-center gap-2 sm:gap-3">
    
    {/* Upload Button */}
    <button
      onClick={() => fileInputRef.current.click()}
      title="Upload image"
      className="
        flex items-center justify-center
        w-11 h-11 sm:w-12 sm:h-12
        rounded-lg
        border
        bg-[#222222]
        shrink-0
      "
      style={{ borderColor }}
    >
      <FaUpload className="text-sm sm:text-base" style={{ color: textPrimary }} />
    </button>

    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileUpload}
      accept="image/*"
      className="hidden"
    />

    {/* Input + Send Wrapper */}
    <div
      className="
        flex items-center
        flex-1
        gap-2
        rounded-xl
        border
        bg-[#222222]
        px-3
      "
      style={{ borderColor }}
    >
      {/* Textarea */}
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Describe your ad idea..."
        rows={1}
        className="
          flex-1
          resize-none
          bg-transparent
          py-3
          text-sm sm:text-base
          leading-6
          focus:outline-none
        "
        style={{ color: textPrimary }}
      />

      {/* Send Button */}
      <button
        onClick={handleSendMessage}
        disabled={isLoading || (!inputText.trim() && !uploadedImage)}
        className="
          flex items-center justify-center
          w-9 h-9 sm:w-10 sm:h-10
          rounded-lg
          shrink-0
          transition
          disabled:opacity-40
        "
        style={{ backgroundColor: primaryColor, color: 'black' }}
      >
        <FaArrowRight className="text-sm sm:text-base" />
      </button>
    </div>
  </div>

  {/* Image Preview */}
  {uploadedImagePreview && (
    <div className="mt-2 flex items-center gap-3">
      <div className="relative">
        <img
          src={uploadedImagePreview}
          alt="Uploaded"
          className="w-14 h-14 rounded-lg object-cover border"
          style={{ borderColor }}
        />

        <button
          onClick={() => {
            setUploadedImage(null);
            setUploadedImagePreview(null);
          }}
          className="
            absolute -top-2 -right-2
            w-5 h-5
            rounded-full
            bg-red-500
            flex items-center justify-center
          "
        >
          <FaTimes className="text-[10px] text-white" />
        </button>
      </div>

      <span
        className="text-xs sm:text-sm truncate max-w-[200px]"
        style={{ color: mutedTextColor }}
      >
        {uploadedImage?.name}
      </span>
    </div>
  )}
</div>

            </div>
          </div>
          
          {/* Right Side - Generated Images */}
          <div className="lg:col-span-1">
            <div style={{ 
              backgroundColor: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              height: '400px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="p-4 border-b" style={{ borderColor: borderColor }}>
                <h3 className="font-semibold" style={{ color: textPrimary }}>Generated Ads</h3>
                <p style={{ color: mutedTextColor, fontSize: '14px', marginTop: '4px' }}>
                  {generatedImages.length} variations
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {generatedImages.length > 0 ? (
                  <div className="space-y-4">
                    {generatedImages.map((image) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                        onClick={() => handleImageEditClick(image)}
                      >
                        <div style={{ 
                          backgroundColor: '#222222',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: `1px solid ${borderColor}`
                        }}>
                          <div className="relative">
                            <img 
                              src={image.url} 
                              alt={image.prompt}
                              style={{ 
                                width: '100%',
                                height: '120px',
                                objectFit: 'cover'
                              }}
                            />
                            <div style={{ 
                              position: 'absolute',
                              top: '8px',
                              left: '8px',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              fontSize: '12px',
                              color: textPrimary
                            }}>
                              {image.platform}
                            </div>
                          </div>
                          
                          <div className="p-3">
                            <p style={{ 
                              fontSize: '14px',
                              color: textPrimary,
                              marginBottom: '8px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {image.prompt}
                            </p>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1" style={{ color: mutedTextColor, fontSize: '12px' }}>
                                  <FaRegThumbsUp /> {image.likes}
                                </div>
                              </div>
                              <div style={{ 
                                fontSize: '11px',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                backgroundColor: '#333333',
                                color: mutedTextColor
                              }}>
                                {image.engagement}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
                    <div style={{ 
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                      opacity: 0.2
                    }}>
                      <FaImage style={{ color: primaryColor, fontSize: '40px' }} />
                    </div>
                    <p style={{ color: mutedTextColor, fontSize: '14px' }}>
                      No ads generated yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPage;