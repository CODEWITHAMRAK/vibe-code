"use client";

import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";

export default function AIChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        const storedExpenses =
            JSON.parse(localStorage.getItem("expenses")) || [];
        setExpenses(storedExpenses);
    }, []);

    useEffect(() => {
        // Auto-scroll to the latest message
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessage = { role: "user", content: userInput };
        setMessages((prev) => [...prev, newMessage]);
        setUserInput("");
        setLoading(true);

        try {
            const response = await fetch("/api/insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: userInput, expenses }),
            });

            const data = await response.json();
            if (data.insights && Array.isArray(data.insights)) {
                const aiMessages = data.insights.map((insight) => ({
                    role: "ai",
                    content: `${insight.title}: ${insight.description}`,
                }));
                setMessages((prev) => [...prev, ...aiMessages]);
            }
        } catch (error) {
            console.error("Error fetching insights:", error);
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "Sorry, something went wrong." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Open AI Chatbot
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[400px] h-[500px] flex flex-col rounded-lg shadow-lg p-2">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                        AI Financial Assistant
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea
                    ref={scrollRef}
                    className="flex-1 mb-3 p-2 space-y-2 overflow-y-auto"
                >
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`p-3 rounded-xl max-w-[75%] break-words shadow-sm ${
                                msg.role === "user"
                                    ? "bg-blue-100 text-blue-900 self-end"
                                    : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white self-start"
                            }`}
                        >
                            {msg.content}
                        </div>
                    ))}

                    {loading && (
                        <div className="p-3 rounded-xl max-w-[60%] bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white flex items-center gap-2 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            AI is typing...
                        </div>
                    )}
                </ScrollArea>

                <div className="flex gap-2">
                    <Input
                        placeholder="Ask a question..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 rounded-lg border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-400"
                    />
                    <Button
                        onClick={sendMessage}
                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg p-2"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
