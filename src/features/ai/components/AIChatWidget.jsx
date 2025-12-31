import { useEffect, useRef, useState } from "react";
import { Bot, User, X, ArrowRight, Loader2, Sparkles, BotIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { cn } from "@/shared/config/utils";
import { Input } from "@/shared/components/ui/input";

export default function AiChatWidget() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: "1",
            role: "ai",
            content: "Hi, I’m EAARTH AI. How can I help you today?",
        },
    ]);

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setTyping(true);

        setTimeout(() => {
            const aiMessage = {
                id: Date.now().toString() + "_ai",
                role: "ai",
                content: "Got it. I’m working on that for you.",
            };

            setMessages((prev) => [...prev, aiMessage]);
            setTyping(false);
        }, 1200);
    };

    return (
        <>
            {/* Floating Button */}
            {!open && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full h-14 w-14 shadow-xl hover:bg-primary/20 backdrop-blur-md"
                        onClick={() => setOpen(true)}
                    >
                        <Bot className="size-8 text-primary animate-bounce" />
                    </Button>
                </div>
            )}

            {/* Chat Panel */}
            {open && (
                <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[90vw] h-[600px] flex flex-col rounded-2xl border bg-card shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                                <Bot className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-semibold">EAARTH AI</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 px-4 py-3 overflow-auto">
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex gap-2",
                                        msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "h-8 w-8 shrink-0 rounded-full flex items-center justify-center",
                                            msg.role === "ai"
                                                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                                                : "bg-primary dark:bg-primary/70 text-primary-foreground"
                                        )}
                                    >
                                        {msg.role === "ai" ? (
                                            <Bot className="h-4 w-4" />
                                        ) : (
                                            <User className="h-4 w-4" />
                                        )}
                                    </div>

                                    <Card
                                        className={cn(
                                            "px-3 py-2.5 text-sm  max-w-[75%] break-words leading-6 tracking-wide",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}
                                    >
                                        {msg.content}
                                    </Card>
                                </div>
                            ))}

                            {typing && (
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <Bot className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <Card className="px-3 py-2 flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-xs text-muted-foreground">
                                            Thinking…
                                        </span>
                                    </Card>
                                </div>
                            )}

                            <div ref={bottomRef} />
                        </div>
                    </div>

                    {/* Input */}
                    <div className="border-t p-3">
                        <div className="relative flex items-center gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Ask EAARTH AI..."
                                className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                            <Button
                                size="icon"
                                onClick={sendMessage}
                                disabled={!input.trim() || typing}
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
