"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, UserPlus, MessageSquare } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";

function MessagesContent() {
  const {
    conversations,
    messages,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    startConversation,
    loading,
  } = useChat();

  const { user } = useSupabaseAuth();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle "Start Chat" via URL param (e.g., from Profile page)
  useEffect(() => {
    const userIdToChat = searchParams?.get("userId");
    if (userIdToChat && !activeConversationId) {
      startConversation(userIdToChat);
    }
  }, [searchParams]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    await sendMessage(inputText);
    setInputText("");
  };

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  if (!user)
    return <div className="p-10 text-center">Please log in to chat.</div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Left Sidebar: Conversations List */}
      <Card className="w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-muted/30 font-bold flex justify-between items-center">
          Messages
          {/* <Button size="icon" variant="ghost"><UserPlus className="h-4 w-4" /></Button> */}
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No conversations yet.
              <br />
              Visit a profile to say hi!
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors flex gap-3 items-center ${activeConversationId === conv.id ? "bg-muted" : ""}`}
              >
                <Avatar>
                  <AvatarImage src={conv.other_user?.avatar_url} />
                  <AvatarFallback>
                    {conv.other_user?.full_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <div className="font-semibold text-sm truncate">
                    {conv.other_user?.full_name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate h-4">
                    {conv.last_message || "Start chatting..."}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Right Side: Chat Window */}
      <Card className="w-2/3 flex flex-col overflow-hidden border shadow-sm">
        {activeConversationId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-muted/30 flex items-center gap-3 shadow-sm z-10">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src={activeConv?.other_user?.avatar_url} />
                <AvatarFallback>
                  {activeConv?.other_user?.full_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-sm">
                  {activeConv?.other_user?.full_name || "Unknown User"}
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 block"></span>{" "}
                  Online
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.length === 0 && (
                <div className="text-center py-10 opacity-50">
                  <p>No messages yet.</p>
                  <p className="text-sm">Say hello! 👋</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}
                  >
                    {!isMe && (
                      <Avatar className="h-6 w-6 mr-2 mt-1">
                        <AvatarImage src={activeConv?.other_user?.avatar_url} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted/80 text-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                      <div
                        className={`text-[9px] mt-1 opacity-70 ${isMe ? "text-primary-foreground/80" : "text-muted-foreground/80"} text-right`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
              <form onSubmit={handleSend} className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full px-4 border-muted-foreground/20 focus-visible:ring-offset-0 focus-visible:ring-1"
                />
                <Button type="submit" size="icon" disabled={!inputText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={<div className="p-10 text-center">Loading messages...</div>}
    >
      <MessagesContent />
    </Suspense>
  );
}
