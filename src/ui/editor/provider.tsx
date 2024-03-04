"use client";

import { UseCompletionOptions } from "ai";
import { UseCompletionHelpers } from "ai/react/dist";
import { createContext } from "react";

export const NovelContext = createContext<{
  completionApi: string;
  useCustomCompletion: (props?: UseCompletionOptions) => UseCompletionHelpers;
}>({
  completionApi: "/api/generate",
  useCustomCompletion: (...props) => ({} as UseCompletionHelpers),
});
