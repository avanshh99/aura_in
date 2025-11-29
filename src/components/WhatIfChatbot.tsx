import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const EXAMPLE_QUERIES = [
    "What if we get 200 burn cases tomorrow?",
    "Can we handle a dengue outbreak?",
    "What's the optimal staff schedule for next week?",
    "Do we have enough O₂ for a pollution spike?",
];

const KNOWLEDGE_BASE: Record<string, string> = {
    'burn cases': `Based on current capacity (50 ER beds, 20 doctors):
• You'll need +8 doctors, +15 nurses
• Stock requirement: 80 burn kits (you have 30, order 50 more)
• Estimated wait time: 45 mins → 2 hours
• Recommendation: Activate overflow protocol, transfer non-critical cases to nearby hospitals`,

    'dengue': `Current stock: 50 O₂ cylinders. Dengue outbreak scenario:
• Predicted daily usage: 12 cylinders (vs. normal 5)
• Stock depletes in 4 days
• Platelet demand: +150 units
• Recommendation: Order 100 cylinders within 48 hours + initiate blood drive`,

    'staff schedule': `Recommended schedule for high-demand period:
• ER: 12-hour shifts (vs. usual 8-hour)
• Add 3 specialists on standby
• Activate on-call pool (12 doctors available within 30 min)
• Total overtime cost: ₹8.5L`,

    'oxygen': `Current O₂ inventory: 50 cylinders
• Normal burn rate: 5 cylinders/day (10 days supply)
• Pollution spike scenario: 15 cylinders/day (3.3 days supply)
• Critical threshold: 20 cylinders (reorder point)
• Recommendation: ORDER NOW - minimum 100 cylinders`,
};

export const WhatIfChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '👋 Hi! I can help you plan for "what-if" scenarios. Ask me about staffing, resources, or surge predictions!',
        },
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);

        // Generate response
        const response = generateResponse(input);
        const assistantMessage: Message = { role: 'assistant', content: response };

        setTimeout(() => {
            setMessages((prev) => [...prev, assistantMessage]);
        }, 500);

        setInput('');
    };

    const generateResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();

        // Check for keywords in knowledge base
        for (const [key, value] of Object.entries(KNOWLEDGE_BASE)) {
            if (lowerQuery.includes(key)) {
                return value;
            }
        }

        // Fallback responses
        if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
            return `I can help you with:
• Predicting resource needs for surges
• Staff scheduling optimization
• Inventory management scenarios
• Festival/epidemic preparedness

Try asking: "${EXAMPLE_QUERIES[0]}"`;
        }

        return `I don't have specific data for that scenario yet. Try asking about:
• Burn cases, dengue, or pollution spikes
• Oxygen or blood supply needs
• Staff scheduling

Example: "${EXAMPLE_QUERIES[1]}"`;
    };

    const handleExampleClick = (query: string) => {
        setInput(query);
    };

    return (
        <>
            {/* Toggle Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Widget */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 flex flex-col z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">What-If Assistant</h3>
                                    <p className="text-xs text-white/80">Ask about scenarios</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Example Queries */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-2">
                                <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Try these:</p>
                                <div className="space-y-2">
                                    {EXAMPLE_QUERIES.slice(0, 2).map((query, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleExampleClick(query)}
                                            className="w-full text-left px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-gray-700 dark:text-slate-300"
                                        >
                                            {query}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask a what-if question..."
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
