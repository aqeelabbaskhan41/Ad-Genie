import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaSave, 
  FaKey, 
  FaRobot,
  FaEye,
  FaEyeSlash,
  FaInfoCircle
} from "react-icons/fa";
import { motion } from "framer-motion";

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
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const providers = [
    { id: "openai", name: "OpenAI", description: "GPT-4, DALL-E 3, GPT-3.5" },
    { id: "anthropic", name: "Anthropic", description: "Claude-3, Claude-2" },
    { id: "stability", name: "Stability AI", description: "SDXL, Stable Diffusion" },
    { id: "midjourney", name: "Midjourney", description: "Midjourney API" },
    { id: "custom", name: "Custom API", description: "Any compatible API" },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    if (!modelName.trim() || !apiKey.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Check for duplicate names
    const existingModels = JSON.parse(localStorage.getItem('customModels') || '[]');
    const isDuplicate = existingModels.some(model => 
      model.name.toLowerCase() === modelName.toLowerCase()
    );

    if (isDuplicate) {
      alert("A model with this name already exists");
      setIsSubmitting(false);
      return;
    }

    // Simulate save delay
    setTimeout(() => {
      const newModel = {
        id: `model_${Date.now()}`,
        name: modelName,
        apiKey: apiKey,
        provider: provider,
        providerName: providers.find(p => p.id === provider)?.name || "Custom",
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      const updatedModels = [...existingModels, newModel];
      localStorage.setItem('customModels', JSON.stringify(updatedModels));

      setIsSubmitting(false);
      navigate('/chat');
    }, 800);
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
            <h1 className="text-2xl font-bold mb-3">Connect AI Model</h1>
            <p className="text-sm" style={{ color: mutedTextColor }}>
              Add your API key to use external AI models
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
                  <FaRobot style={{ color: mutedTextColor }} size={14} />
                </div>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="My GPT-4 Model"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1a1a] border focus:outline-none focus:ring-1 transition text-sm"
                  style={{ 
                    borderColor: modelName ? primaryColor + "40" : borderColor,
                    color: textPrimary,
                  }}
                  required
                />
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textPrimary }}>
                AI Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border focus:outline-none focus:ring-1 transition text-sm"
                style={{ 
                  borderColor: borderColor,
                  color: textPrimary,
                }}
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs" style={{ color: mutedTextColor }}>
                {providers.find(p => p.id === provider)?.description}
              </p>
            </div>

            {/* API Key */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium" style={{ color: textPrimary }}>
                  API Key
                </label>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="flex items-center gap-1 text-xs hover:opacity-80 transition"
                  style={{ color: mutedTextColor }}
                >
                  {showApiKey ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                  {showApiKey ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaKey style={{ color: mutedTextColor }} size={14} />
                </div>
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#1a1a1a] border focus:outline-none focus:ring-1 transition text-sm font-mono"
                  style={{ 
                    borderColor: apiKey ? primaryColor + "40" : borderColor,
                    color: textPrimary,
                  }}
                  required
                />
              </div>
              <p className="mt-2 text-xs flex items-start gap-1" style={{ color: mutedTextColor }}>
                <FaInfoCircle size={10} className="mt-0.5 flex-shrink-0" />
                Your API key is stored locally in your browser
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
                    <span>Connect Model</span>
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
            <li>• API keys are stored locally in your browser</li>
            <li>• Keys are never sent to our servers</li>
            <li>• Clear browser data to remove stored keys</li>
            <li>• Use environment variables in production</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AddModelPage;