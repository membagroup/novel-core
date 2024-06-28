"use client";

import { createContext } from "react";

export const NovelContext = createContext<{
  completionApi: string;
  additionalData: Record<string, any>;
}>({
  completionApi: "/api/generate",
  additionalData: {},
});
