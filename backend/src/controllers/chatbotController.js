const groqService = require('../services/groqService');
const Chat = require('../models/chatModel');
const CustomModel = require('../models/customModel');

exports.chat = async (req, res, next) => {
  try {
    const { message, sessionId, modelId } = req.body;
    const userId = req.userId; 

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // 1. Find chat session
    let chat;
    if (sessionId) {
        // Find by specific sessionId
        chat = await Chat.findOne({ sessionId });
    }

    // 2. If no chat found, create a NEW one
    if (!chat) {
        const newSessionId = sessionId || `session_${Date.now()}`;
        chat = new Chat({
            userId: userId || null,
            sessionId: newSessionId,
            title: message.substring(0, 30) + (message.length > 30 ? '...' : '') // Initial title from first message
        });
    }

    // 3. Add user message
    chat.messages.push({
        role: 'user',
        type: 'text',
        content: message
    });

    // 4. Prepare history for Groq
    const history = chat.messages.slice(0, -1).map(msg => ({
        role: msg.role,
        content: msg.content
    }));

    // 5. Fetch custom model if modelId is provided (for image gen)
    let customModelConfig = null;
    if (modelId && modelId !== 'default') {
        customModelConfig = await CustomModel.findOne({ _id: modelId, userId: userId || null });
    }

    // 6. Set up streaming headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    // 7. Call Groq Streaming Service
    const stream = groqService.handleChatStream(history, message, userId, chat._id, customModelConfig);
    let finalBotResponse = null;

    for await (const chunk of stream) {
        res.write(JSON.stringify(chunk) + "\n");
        if (chunk.type === 'final_result') {
            finalBotResponse = chunk;
        }
    }

    // 7. Save bot response to history once finished
    if (finalBotResponse) {
        chat.messages.push({
            role: 'assistant',
            type: finalBotResponse.resultType,
            content: finalBotResponse.text,
            imageUrl: finalBotResponse.resultType === 'image' ? finalBotResponse.generatedImage.imageUrl : null
        });
        await chat.save();
    }

    res.end();

  } catch (error) {
    console.error("Chat Controller Error:", error);
    if (!res.headersSent) {
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    } else {
        console.error("Stream error after headers sent:", error);
        res.write(JSON.stringify({ type: 'text_chunk', content: "\n\n(Error processing response)" }) + "\n");
        res.end();
    }
  }
};

exports.getHistory = async (req, res, next) => {
    try {
        const { sessionId } = req.query;
        const userId = req.userId; 
        
        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'sessionId is required' });
        }

        const chat = await Chat.findOne({ sessionId });

        if (!chat) {
            return res.status(200).json({ success: true, messages: [], sessionId: sessionId });
        }

        res.status(200).json({
            success: true,
            sessionId: chat.sessionId,
            messages: chat.messages,
            title: chat.title
        });

    } catch (error) {
        next(error);
    }
}

exports.getSessions = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { sessionId } = req.query; // If anonymous, we might still want to list sessions stored in localstorage but this endpoint usually for logged in users
        
        let query = {};
        if (userId) {
            query = { userId };
        } else if (sessionId) {
            query = { sessionId }; // Only one session if anonymous usually, but we keep it open
        } else {
            return res.status(200).json({ success: true, sessions: [] });
        }

        const sessions = await Chat.find(query)
            .select('sessionId title createdAt updatedAt')
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            sessions: sessions
        });

    } catch (error) {
        next(error);
    }
}

exports.deleteSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.userId;

        let query = { sessionId };
        if (userId) {
            query.userId = userId;
        }

        const deleted = await Chat.findOneAndDelete(query);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Session not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Session deleted successfully" });
    } catch (error) {
        next(error);
    }
}

exports.toggleShare = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.userId;

        const chat = await Chat.findOne({ sessionId, userId });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }

        chat.isPublic = !chat.isPublic;
        await chat.save();

        res.status(200).json({ 
            success: true, 
            isPublic: chat.isPublic,
            message: chat.isPublic ? "Chat is now public" : "Chat is now private" 
        });
    } catch (error) {
        next(error);
    }
}

exports.getPublicChat = async (req, res, next) => {
    try {
        const { sessionId } = req.params;

        const chat = await Chat.findOne({ sessionId, isPublic: true });
        if (!chat) {
            return res.status(404).json({ success: false, message: "Public chat not found" });
        }

        res.status(200).json({
            success: true,
            title: chat.title,
            messages: chat.messages
        });
    } catch (error) {
        next(error);
    }
}
