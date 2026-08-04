"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, Bot } from "lucide-react";
import { useToast } from "@/components/ToastContext";
import { CartContext } from "@/components/CartContext";
import { getOrders } from "@/services/orders";
import {
  NowAssistProductCard,
  type NowAssistProduct,
} from "./NowAssistProductCard";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  products?: NowAssistProduct[];
};

function buildOrdersSummary() {
  try {
    return getOrders()
      .slice(0, 8)
      .map((order) => ({
        orderNumber: order.orderNumber,
        status: order.status,
        items: order.items.slice(0, 5).map((item) => item.model),
      }));
  } catch {
    return [];
  }
}

function AssistantAvatar() {
  return (
    <div
      className="flex-shrink-0 w-8 h-8 rounded-full bg-deepBlue text-white flex items-center justify-center shadow-sm"
      aria-hidden="true"
    >
      <Sparkles className="w-4 h-4" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[90%]">
      <AssistantAvatar />
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export function NowAssistWidget() {
  const pathname = usePathname();
  const { addToast } = useToast();
  const { addToCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<NowAssistProduct[]>(
    [],
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I’m NowAssist. Tell me what you’re trying to do — like “I need a laptop for video editing” — and I’ll recommend gear from the catalog. You can also say “add those to my cart.”",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, loading]);

  if (pathname === "/login") {
    return null;
  }

  const applyCartAdds = (items: NowAssistProduct[]) => {
    if (!items.length) return;
    items.forEach((product) => {
      addToCart(
        {
          model: product.model,
          brand: product.brand,
          image: product.image,
          price: product.price,
          quantity: 1,
          recommended: product.recommended,
          description: product.description,
          card_description: product.description,
          category: product.category,
        },
        { silent: true },
      );
    });
    addToast(
      items.length === 1
        ? `${items[0].model} added to cart`
        : `${items.length} items added to cart`,
      "success",
    );
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const history = messages
      .filter((m) => m.id !== "welcome")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/nowassist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history,
          ordersSummary: buildOrdersSummary(),
          suggestedModels: suggestedProducts.map((p) => p.model),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "NowAssist request failed");
      }

      const products: NowAssistProduct[] = Array.isArray(data.products)
        ? data.products
        : [];
      let addToCartItems: NowAssistProduct[] = Array.isArray(data.addToCart)
        ? data.addToCart
        : [];

      const wantsCart =
        /\b(add|put|move)\b[\s\S]{0,40}\b(cart|basket)\b|\badd (them|those|all|it)\b/i.test(
          trimmed,
        );
      if (addToCartItems.length === 0 && wantsCart && suggestedProducts.length > 0) {
        addToCartItems = suggestedProducts;
      }

      if (products.length > 0) {
        setSuggestedProducts(products);
      }

      if (addToCartItems.length > 0) {
        applyCartAdds(addToCartItems);
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          data.reply ||
          (addToCartItems.length
            ? `Added ${addToCartItems.length} item${addToCartItems.length === 1 ? "" : "s"} to your cart.`
            : "Here are some options from the catalog."),
        products,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "NowAssist is unavailable";
      addToast(message, "error");
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content:
            "Sorry — I couldn’t complete that request. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 pointer-events-none">
      {open && (
        <div
          className="pointer-events-auto w-[min(100vw-2rem,400px)] h-[min(72vh,600px)] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,7,31,0.25)] border border-gray-200 flex flex-col overflow-hidden"
          role="dialog"
          aria-label="IT Hardware Assistant"
        >
          <div className="bg-deepBlue text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-heritageBlue/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">IT Hardware Assistant</p>
                <p className="text-[11px] text-white/70">NowAssist</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-[#F5F7FA]">
            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[82%] rounded-2xl rounded-br-md bg-heritageBlue text-white px-3.5 py-2.5 text-sm leading-relaxed shadow-sm">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex items-start gap-2 max-w-full">
                  <AssistantAvatar />
                  <div className="flex-1 min-w-0 space-y-2.5">
                    <div className="inline-block max-w-[92%] rounded-2xl rounded-bl-md bg-white text-gray-800 border border-gray-200 px-3.5 py-2.5 text-sm leading-relaxed shadow-sm">
                      {message.content}
                    </div>
                    {message.products && message.products.length > 0 && (
                      <div className="space-y-2.5 max-w-[92%]">
                        {message.products.map((product) => (
                          <NowAssistProductCard
                            key={`${message.id}-${product.model}`}
                            product={product}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ),
            )}
            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          <form
            className="border-t border-gray-200 p-3 bg-white flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
          >
            <label htmlFor="nowassist-input" className="sr-only">
              Ask anything
            </label>
            <input
              id="nowassist-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={loading}
              className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-heritageBlue focus:border-transparent focus:bg-white disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-heritageBlue text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="pointer-events-auto w-14 h-14 rounded-full bg-heritageBlue text-white shadow-[0_8px_24px_rgba(37,90,246,0.45)] hover:bg-blue-700 transition-colors flex items-center justify-center"
        aria-label={open ? "Close NowAssist" : "Open NowAssist"}
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>
    </div>
  );
}
