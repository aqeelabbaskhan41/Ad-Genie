import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaSave, 
  FaKey, 
  FaRobot,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
  FaCogs,
  FaChevronDown,
  FaLink
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const STABILITY_MODELS = [
  { id: "ultra", name: "Stable Image Ultra", endpoint: "https://api.stability.ai/v2beta/stable-image/generate/ultra", description: "Highest quality images with great detail" },
  { id: "core", name: "Stable Image Core", endpoint: "https://api.stability.ai/v2beta/stable-image/generate/core", description: "Fast, high-quality generation for most use cases" },
  { id: "sd3-large", name: "Stable Diffusion 3.0 Large", endpoint: "https://api.stability.ai/v2beta/stable-image/generate/sd3", description: "SD3 Large (8B parameters) for complex prompts" },
  { id: "sd3-medium", name: "Stable Diffusion 3.0 Medium", endpoint: "https://api.stability.ai/v2beta/stable-image/generate/sd3", description: "SD3 Medium (2B parameters)" },
  { id: "sdxl", name: "SDXL 1.0", endpoint: "https://api.stability.ai/v2beta/stable-image/generate/sdxl", description: "The classic high-performance base model" },
];

function AddModelPage() {
  const navigate = useNavigate();
  
  const primaryColor = "#5bf0a5";
  const bgColor = "#000000";
  const cardBg = "#111111";
  const borderColor = "#222222";
  const textPrimary = "#ffffff";
  const mutedTextColor = "#888888";

  const [modelName, setModelName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("openai");
  const [modelId, setModelId] = useState("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const providers = [
    { id: "openai", name: "OpenAI", description: "DALL-E 3, DALL-E 2", needsModelId: true, modelIdPlaceholder: "dall-e-3" },
    { id: "google", name: "Google Gemini", description: "Imagen 3 via Gemini API", needsModelId: true, modelIdPlaceholder: "imagen-3.0-generate-001" },
    { id: "stability", name: "Stability AI", description: "SDXL, SD3, Ultra, Core", needsModelId: false, needsStabilityModels: true },
    { id: "huggingface", name: "Hugging Face", description: "Full repository ID required", needsModelId: true, needsEndpoint: true, endpointOptional: true, modelIdPlaceholder: "runwayml/stable-diffusion-v1-5" },
    { id: "custom", name: "Other", description: "Any compatible API", needsModelId: true, needsEndpoint: true, modelIdPlaceholder: "model-name" },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!modelName.trim() || !apiKey.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const token = localStorage.getItem('token');
    
    console.log('[AddModel] Token found in localStorage:', token ? (token.substring(0, 10) + "...") : "MISSING");
    console.log('[AddModel] Target URL:', `${API_BASE}/models`);

    try {
      const response = await fetch(`${API_BASE}/models`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: modelName,
          provider: provider,
          apiKey: apiKey.trim(),
          modelId: modelId || undefined,
          endpointUrl: endpointUrl || undefined
        })
      });

      if (response.status === 401) {
        alert("Your session has expired. Please login again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setIsSubmitting(false);
        navigate('/chat');
      } else {
        alert(data.message || "Failed to add model");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Failed to add model:", error);
      alert("An error occurred while connecting the model.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ 
      backgroundColor: bgColor,
      fontFamily: "Inter, sans-serif",
      color: textPrimary
    }}>
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 mb-6 hover:opacity-80 transition"
            style={{ color: mutedTextColor }}
          >
            <FaArrowLeft /> 
            <span>Back to Chat</span>
          </button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-3">Connect Image Generation Model</h1>
            <p className="text-sm" style={{ color: mutedTextColor }}>
              Add your API keys to use external image generation engines
            </p>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '24px'
          }}
        >
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Model Name */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                Model Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaRobot style={{ color: focusedField === 'modelName' ? primaryColor : mutedTextColor }} size={14} />
                </div>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  onFocus={() => setFocusedField('modelName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="My DALL-E 3 config"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1a1a] border transition text-sm focus:outline-none"
                  style={{ 
                    borderColor: focusedField === 'modelName' ? primaryColor + "60" : borderColor,
                    boxShadow: focusedField === 'modelName' ? `0 0 0 1px ${primaryColor}40` : 'none',
                    color: textPrimary,
                  }}
                  required
                />
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                Image Engine / Provider
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  onFocus={() => setFocusedField('provider')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#1a1a1a] border transition text-sm text-left flex items-center justify-between focus:outline-none"
                  style={{ 
                    borderColor: focusedField === 'provider' || isDropdownOpen ? primaryColor + "60" : borderColor,
                    boxShadow: focusedField === 'provider' || isDropdownOpen ? `0 0 0 1px ${primaryColor}40` : 'none',
                    color: textPrimary,
                  }}
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCogs style={{ color: focusedField === 'provider' || isDropdownOpen ? primaryColor : mutedTextColor }} size={14} />
                  </div>
                  <span>{providers.find(p => p.id === provider)?.name || "Select Provider"}</span>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronDown style={{ color: primaryColor }} size={10} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 w-full mt-2 py-1 rounded-lg bg-[#111111] border overflow-hidden shadow-xl"
                      style={{ borderColor: primaryColor + "40" }}
                    >
                      {providers.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setProvider(p.id);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm transition-colors flex flex-col gap-0.5"
                          style={{ 
                            backgroundColor: provider === p.id ? primaryColor + "15" : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (provider !== p.id) e.currentTarget.style.backgroundColor = primaryColor + "10";
                          }}
                          onMouseLeave={(e) => {
                            if (provider !== p.id) e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          <span style={{ color: provider === p.id ? primaryColor : textPrimary, fontWeight: provider === p.id ? '600' : '400' }}>
                            {p.name}
                          </span>
                          <span className="text-[10px]" style={{ color: mutedTextColor }}>
                            {p.description}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="mt-1 text-xs" style={{ color: mutedTextColor }}>
                {providers.find(p => p.id === provider)?.description}
              </p>
            </div>

            {/* Model ID / Endpoint for specific providers */}
            {providers.find(p => p.id === provider)?.needsModelId && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                  Model Name / ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaRobot style={{ color: focusedField === 'modelId' ? primaryColor : mutedTextColor }} size={14} />
                  </div>
                  <input
                    type="text"
                    value={modelId}
                    onChange={(e) => setModelId(e.target.value)}
                    onFocus={() => setFocusedField('modelId')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={providers.find(p => p.id === provider)?.modelIdPlaceholder || "e.g., dall-e-3"}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1a1a] border transition text-sm focus:outline-none"
                    style={{ 
                      borderColor: focusedField === 'modelId' ? primaryColor + "60" : borderColor,
                      boxShadow: focusedField === 'modelId' ? `0 0 0 1px ${primaryColor}40` : 'none',
                      color: textPrimary,
                    }}
                    required
                  />
                </div>
                <p className="mt-1 text-[10px]" style={{ color: mutedTextColor }}>
                  {provider === 'huggingface' ? "The full repo name (e.g., runwayml/stable-diffusion-v1-5)" : "Specify which model to use from this provider"}
                </p>
              </div>
            )}

            {/* Stability Model Selection */}
            {providers.find(p => p.id === provider)?.needsStabilityModels && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                  Stability AI Model
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {STABILITY_MODELS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setModelId(m.id);
                        setEndpointUrl(m.endpoint);
                      }}
                      className="p-3 rounded-lg border text-left transition relative"
                      style={{ 
                        backgroundColor: modelId === m.id ? primaryColor + "10" : '#1a1a1a',
                        borderColor: modelId === m.id ? primaryColor : borderColor,
                      }}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold" style={{ color: modelId === m.id ? primaryColor : textPrimary }}>
                          {m.name}
                        </span>
                        {modelId === m.id && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>}
                      </div>
                      <p className="text-[10px]" style={{ color: mutedTextColor }}>{m.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {providers.find(p => p.id === provider)?.needsEndpoint && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                  API Endpoint URL {providers.find(p => p.id === provider)?.endpointOptional && "(Optional)"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLink style={{ color: focusedField === 'endpointUrl' ? primaryColor : mutedTextColor }} size={14} />
                  </div>
                  <input
                    type="url"
                    value={endpointUrl}
                    onChange={(e) => setEndpointUrl(e.target.value)}
                    onFocus={() => setFocusedField('endpointUrl')}
                    onBlur={() => setFocusedField(null)}
                    placeholder={provider === 'huggingface' ? "https://api-inference.huggingface.co/models/..." : "https://api.example.com/v1/generate"}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1a1a] border transition text-sm focus:outline-none"
                    style={{ 
                      borderColor: focusedField === 'endpointUrl' ? primaryColor + "60" : borderColor,
                      boxShadow: focusedField === 'endpointUrl' ? `0 0 0 1px ${primaryColor}40` : 'none',
                      color: textPrimary,
                    }}
                    required={!providers.find(p => p.id === provider)?.endpointOptional}
                  />
                </div>
                {provider === 'huggingface' && (
                  <p className="mt-1 text-[10px]" style={{ color: mutedTextColor }}>
                    Leave blank to use the standard Hugging Face Inference API.
                  </p>
                )}
              </div>
            )}

            {/* API Key */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium" style={{ color: textPrimary }}>
                  API Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="flex items-center gap-1.5 text-xs hover:opacity-80 transition py-1"
                  style={{ color: mutedTextColor }}
                >
                  <span className="flex items-center h-full">
                    {showApiKey ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </span>
                  <span className="leading-none">{showApiKey ? "Hide" : "Show"}</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey style={{ color: focusedField === 'apiKey' ? primaryColor : mutedTextColor }} size={14} />
                </div>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onFocus={() => setFocusedField('apiKey')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="sk-..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1a1a] border transition text-sm font-mono focus:outline-none"
                  style={{ 
                    borderColor: focusedField === 'apiKey' ? primaryColor + "60" : borderColor,
                    boxShadow: focusedField === 'apiKey' ? `0 0 0 1px ${primaryColor}40` : 'none',
                    color: textPrimary,
                  }}
                  required
                />
              </div>
              <p className="mt-2 text-xs flex items-start gap-1" style={{ color: mutedTextColor }}>
                <FaInfoCircle size={10} className="mt-0.5 flex-shrink-0" />
                Your API key is stored securely in our database
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !modelName || !apiKey}
                className="w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: primaryColor, 
                  color: 'black',
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <FaSave size={14} />
                    <span>Connect Image Model</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Security Note */}
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <FaInfoCircle style={{ color: primaryColor }} size={12} />
            Security Information
          </h3>
          <ul className="text-xs space-y-1" style={{ color: mutedTextColor }}>
            <li>• API keys are stored securely in our database</li>
            <li>• Keys are used only for your image generation requests</li>
            <li>• Use the 'Delete' button to remove stored keys</li>
            <li>• Use environment variables in production</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddModelPage;