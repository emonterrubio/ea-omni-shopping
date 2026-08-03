import { z } from "zod";

export const SearchQuerySchema = z.object({
  query: z.string().trim().min(1).max(200),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const NowAssistHistorySchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

export const NowAssistOrdersSummarySchema = z.object({
  orderNumber: z.string(),
  status: z.string(),
  items: z.array(z.string()).max(10),
});

export const NowAssistRequestSchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z.array(NowAssistHistorySchema).max(8).optional(),
  ordersSummary: z.array(NowAssistOrdersSummarySchema).max(10).optional(),
});

export type NowAssistRequest = z.infer<typeof NowAssistRequestSchema>;

export const NowAssistClaudeResponseSchema = z.object({
  reply: z.string().min(1),
  products: z.array(z.string()).max(3).default([]),
});
