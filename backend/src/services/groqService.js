const axios = require('axios');
const { Groq } = require('groq-sdk');
const hpcService = require('./hpcService');
const fileStorage = require('../utils/fileStorage');
const Image = require('../models/imageModel');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Define the tool for generating ads
const generateAdTool = {
    type: "function",
    function: {
        name: "generate_ad_image",
        description: "Generates an advertisement image based on a user's prompt or idea. Call this ONLY when the user asks to generate, create, or make an ad or an image.",
        parameters: {
            type: "object",
            properties: {
                prompt: {
                    type: "string",
                    description: "The detailed prompt to use for generating the ad image. Please try to expand the user's idea into a highly detailed and descriptive image generation prompt.",
                }
            },
            required: ["prompt"],
        },
    }
};

/**
 * Streaming chat interface for Groq integration
 * @param {Array} history Array of previous message objects
 * @param {string} newMessage The new user message
 * @param {string} userId (optional) Database userId
 * @param {string} chatId (optional) Database chatId
 * @param {Object} customModelConfig (optional) Custom image model configuration
 * @yields {Object} Chunks of text or the final result with an image
 */
exports.handleChatStream = async function* (history, newMessage, userId, chatId, customModelConfig) {
    console.log(`[Stream] Starting stream for user: ${userId}, chat: ${chatId}`);
    try {
        const systemPrompt = {
            role: "system",
            content: "You are AdGenie, a creative and versatile AI assistant. You have access to ONLY ONE tool: 'generate_ad_image'. DO NOT attempt to call any other functions or tools (like 'print', 'search', etc.). While your specialty is brainstorming advertisement ideas and generating visual ads, you are also happy to help with general questions, code snippets, or miscellaneous tasks using standard text responses. Be helpful, professional, and creative. Always use markdown for formatting. If you call 'generate_ad_image', do not provide a long description of the image afterwards, as the system will show it."
        };

        const messages = [
            systemPrompt,
            ...history.map(msg => ({ role: msg.role, content: msg.content })),
            { role: "user", content: newMessage }
        ];

        let stream;
        try {
            // 1. Initial call with streaming and tools
            stream = await groq.chat.completions.create({
                model: "llama-3.1-8b-instant",
                messages: messages,
                tools: [generateAdTool],
                tool_choice: "auto",
                stream: true,
                temperature: 0.7
            });
        } catch (apiErr) {
            console.error("Groq API Completion Error:", apiErr);
            yield { type: 'text_chunk', content: `\n\n**Error**: I encountered an issue with the AI service (${apiErr.message}). Please try rephrasing your request or check your model settings.` };
            yield { type: 'final_result', resultType: 'text', text: "(Connection Error)" };
            return;
        }

        let fullContent = "";
        let toolCalls = [];
        let isToolCallDetected = false;
        let tagBuffer = "";

        try {
            for await (const chunk of stream) {
                const delta = chunk.choices[0]?.delta;
                
                if (delta?.content) {
                    if (!isToolCallDetected) {
                        const potentialContent = fullContent + delta.content;
                        if (potentialContent.includes('<function')) {
                            isToolCallDetected = true;
                            const parts = potentialContent.split('<function');
                            fullContent = parts[0];
                            tagBuffer = '<function' + (parts[1] || "");
                        } else {
                            fullContent += delta.content;
                            yield { type: 'text_chunk', content: delta.content };
                        }
                    } else {
                        tagBuffer += delta.content;
                    }
                }

                if (delta?.tool_calls) {
                    isToolCallDetected = true;
                    for (const tc of delta.tool_calls) {
                        if (!toolCalls[tc.index]) {
                            toolCalls[tc.index] = { id: tc.id, function: { name: "", arguments: "" } };
                        }
                        if (tc.function?.name) toolCalls[tc.index].function.name += tc.function.name;
                        if (tc.function?.arguments) toolCalls[tc.index].function.arguments += tc.function.arguments;
                    }
                }
            }
        } catch (streamErr) {
            console.error("Groq Aggregate Stream Error:", streamErr);
            yield { type: 'text_chunk', content: `\n\n**Error**: The response stream was interrupted (${streamErr.message}).` };
            yield { type: 'final_result', resultType: 'text', text: fullContent + "\n\n(Stream interrupted)" };
            return;
        }

        // 2. Handle Text-Tag Tool Calls (manual extraction)
        if (toolCalls.length === 0 && tagBuffer.includes('<function')) {
            try {
                const nameMatch = tagBuffer.match(/<function=([^>]+)>/);
                const argsMatch = tagBuffer.match(/>([\s\S]+?)<\/function>/);
                
                if (nameMatch && argsMatch) {
                    toolCalls.push({
                        id: `call_${Date.now()}`,
                        function: {
                            name: nameMatch[1],
                            arguments: argsMatch[1].trim()
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to parse manual tool tag:", e);
            }
        }

        // 3. If tool calls were made, handle them
        if (toolCalls.length > 0) {
            const toolCall = toolCalls[0]; 
            
            if (toolCall.function.name === "generate_ad_image") {
                let args;
                try {
                    let rawArgs = toolCall.function.arguments.trim();
                    args = JSON.parse(rawArgs);
                } catch (e) {
                    console.error("JSON Parse Error on Tool Args:", toolCall.function.arguments);
                    yield { type: 'text_chunk', content: "\n\n(Error parsing image generation parameters)" };
                    return;
                }
                
                const generatedPrompt = args.prompt;
                yield { type: 'status', content: 'Generating image...' };
                
                let hpcResult;
                let imageBase64;
                let genTime = 0;
                let modelTime = 0;

                try {
                    if (customModelConfig && customModelConfig.provider === 'openai') {
                        // Handle OpenAI DALL-E
                        const { OpenAI } = require('openai');
                        const openai = new OpenAI({ apiKey: customModelConfig.apiKey });
                        const response = await openai.images.generate({
                            model: customModelConfig.modelId || "dall-e-3",
                            prompt: generatedPrompt,
                            n: 1,
                            size: "1024x1024",
                            response_format: "b64_json"
                        });
                        imageBase64 = response.data[0].b64_json;
                        genTime = 0; // OpenAI doesn't provide this directly in the same way
                    } else if (customModelConfig && customModelConfig.provider === 'stability') {
                        // Handle Stability AI v2beta endpoints
                        const modelId = customModelConfig.modelId || "core"; 
                        const endpoint = customModelConfig.endpointUrl || `https://api.stability.ai/v2beta/stable-image/generate/${modelId}`;
                        
                        console.log(`[Stability] Requesting model ${modelId} at ${endpoint}`);

                        // Using standard axios.post with multipart/form-data for maximum compatibility
                        const FormData = require('form-data');
                        const form = new FormData();
                        form.append('prompt', generatedPrompt);
                        form.append('output_format', 'webp');

                        const response = await axios.post(
                            endpoint,
                            form,
                            {
                                validateStatus: (status) => status < 500,
                                responseType: 'arraybuffer',
                                headers: { 
                                    ...form.getHeaders(),
                                    Authorization: `Bearer ${customModelConfig.apiKey.trim()}`, 
                                    Accept: "image/*"
                                },
                            }
                        );

                        if (response.status === 200) {
                            imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
                            console.log('[Stability] Success: Received image binary');
                        } else {
                            let errorDetail = "";
                            try {
                                const decoder = new TextDecoder();
                                const jsonError = JSON.parse(decoder.decode(response.data));
                                errorDetail = jsonError.errors?.join(', ') || jsonError.message || JSON.stringify(jsonError);
                            } catch (e) {
                                try {
                                    errorDetail = Buffer.from(response.data).toString();
                                } catch (e2) {
                                    errorDetail = response.statusText;
                                }
                            }
                            throw new Error(`Stability AI Error (${response.status}): ${errorDetail}`);
                        }
                    } else if (customModelConfig && customModelConfig.provider === 'huggingface') {
                        // Handle Hugging Face Inference API
                        const axios = require('axios');
                        const hfModel = customModelConfig.modelId || "runwayml/stable-diffusion-v1-5";
                        const endpoint = customModelConfig.endpointUrl || `https://api-inference.huggingface.co/models/${hfModel}`;
                        
                        const response = await axios.post(
                            endpoint,
                            { inputs: generatedPrompt },
                            {
                                headers: { 
                                    Authorization: `Bearer ${customModelConfig.apiKey}`,
                                    'Content-Type': 'application/json'
                                },
                                responseType: 'arraybuffer'
                            }
                        );

                        if (response.status === 200) {
                            imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
                        } else {
                            throw new Error(`Hugging Face Error: ${response.statusText}`);
                        }
                    } else if (customModelConfig && customModelConfig.provider === 'custom' && customModelConfig.endpointUrl) {
                        // Handle Custom API Endpoint
                        const axios = require('axios');
                        const response = await axios.post(
                            customModelConfig.endpointUrl,
                            { 
                                prompt: generatedPrompt,
                                model: customModelConfig.modelId || undefined
                            },
                            {
                                headers: { 
                                    Authorization: `Bearer ${customModelConfig.apiKey}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        if (response.data && (response.data.image || response.data.image_base64 || response.data.url)) {
                            imageBase64 = response.data.image || response.data.image_base64 || response.data.url;
                            // If it's a URL, we might need to fetch it or handle it differently, 
                            // but usually custom APIs for image gen return base64 or a local link.
                        } else {
                            throw new Error(`Custom API Error: Unexpected response format`);
                        }
                    } else if (customModelConfig && customModelConfig.provider === 'google') {
                        // Handle Google Gemini (Imagen)
                        const axios = require('axios');
                        const model = customModelConfig.modelId || "imagen-3.0-generate-001";
                        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${customModelConfig.apiKey}`;
                        
                        const response = await axios.post(url, {
                            instances: [{ prompt: generatedPrompt }],
                            parameters: { sampleCount: 1 }
                        });

                        if (response.data && response.data.predictions && response.data.predictions[0].bytesBase64Encoded) {
                            imageBase64 = response.data.predictions[0].bytesBase64Encoded;
                        } else {
                            throw new Error(`Gemini Error: ${JSON.stringify(response.data)}`);
                        }
                    } else {
                        // Default HPC Service
                        hpcResult = await hpcService.generateImage(generatedPrompt);
                        imageBase64 = hpcResult.image_base64;
                        genTime = hpcResult.gen_time;
                        modelTime = hpcResult.model_time;
                    }
                } catch (imgErr) {
                    console.error("Image Generation Error:", imgErr);
                    let errMsg = customModelConfig ? `the ${customModelConfig.provider} service` : "the local image generation service (port 7860)";
                    yield { type: 'text_chunk', content: `\n\n**Note**: I couldn't reach ${errMsg}. ${imgErr.message}` };
                    yield { type: 'final_result', resultType: 'text', text: fullContent + `\n\n(Image generation service unavailable: ${imgErr.message})` };
                    return;
                }

                const localImageUrl = fileStorage.saveBase64Image(imageBase64);

                const newImage = new Image({
                    userId: userId || null,
                    chatId: chatId || null,
                    prompt: generatedPrompt,
                    imageUrl: localImageUrl,
                    genTime: genTime,
                    modelTime: modelTime
                });
                await newImage.save();

                const confirmationText = "\n\nI've generated the advertisement image for you based on that concept.";
                yield { type: 'text_chunk', content: confirmationText };

                yield { 
                    type: 'final_result', 
                    resultType: 'image', 
                    text: fullContent + confirmationText, 
                    generatedImage: newImage 
                };
                return;
            } else {
                // If it called a non-existent tool, just return the text we have
                yield { type: 'final_result', resultType: 'text', text: fullContent };
                return;
            }
        }

        // 4. Final result for plain text
        yield { type: 'final_result', resultType: 'text', text: fullContent };

    } catch (error) {
        console.error("CRITICAL: General Stream Logic Error:", error);
        yield { type: 'text_chunk', content: `\n\n**Unexpected Error**: Something went wrong while processing the AI response (${error.message || 'Internal Error'}).` };
        yield { type: "final_result", resultType: "text", text: "(Error occurred)" };
    }
};
