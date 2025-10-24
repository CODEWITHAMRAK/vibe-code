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
import { Loader2, Send, Bot } from "lucide-react";
import dayjs from "dayjs";

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
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessage = {
            role: "user",
            content: userInput,
            time: new Date(),
        };
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
                    time: new Date(),
                }));
                setMessages((prev) => [...prev, ...aiMessages]);
            }
        } catch (error) {
            console.error("Error fetching insights:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: "Sorry, something went wrong.",
                    time: new Date(),
                },
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
                <Button className="bg-blue-600 fixed bottom-10 right-10 text-white hover:bg-blue-700 flex items-center gap-2">
                    <Bot /> Open AI Chatbot
                </Button>
            </DialogTrigger>

            <DialogContent className="w-[600px] h-[700px] flex flex-col rounded-xl shadow-xl p-4">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                        Fox AI Assistant
                    </DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Ask questions about your expenses and get smart
                        financial insights.
                    </p>
                </DialogHeader>

                <div
                    ref={scrollRef}
                    className="flex-1 mt-2 p-3 space-y-3 overflow-y-auto rounded-lg bg-gray-50 dark:bg-slate-900 flex flex-col justify-center items-center"
                >
                    {messages.length === 0 && !loading && (
                        <div className="text-center text-gray-400 dark:text-gray-500 mt-20">
                            <p className="text-lg mb-2">No messages yet</p>
                            <p className="text-sm">
                                Start by asking a question about your expenses!
                            </p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col p-3 rounded-xl mb-2 max-w-[75%] break-words shadow ${
                                msg.role === "user"
                                    ? "bg-blue-100 text-blue-900 self-end"
                                    : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white self-start"
                            }`}
                        >
                            <span>{msg.content}</span>
                            <span className="text-xs text-gray-400 mt-1 self-end">
                                {dayjs(msg.time).format("HH:mm")}
                            </span>
                        </div>
                    ))}

                    {loading && (
                        <div className="p-3 rounded-xl max-w-[60%] mb-2 bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white flex items-center gap-2 animate-pulse">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            AI is typing...
                        </div>
                    )}
                </div>

                <div className="flex gap-2 mt-3">
                    <Input
                        placeholder="Type your question here and press Enter..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 rounded-lg border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-400 p-3"
                    />
                    <Button
                        onClick={sendMessage}
                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg p-3"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
