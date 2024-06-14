"use client";

import { UseCompletionOptions } from "ai";
import { UseCompletionHelpers } from "ai/react/dist";
import { createContext } from "react";
import { CommandListProps } from "./interface";

interface NovelContextValue {
  lastTextKey: string;
  completionApi: string;
  feedbackCallback: () => void;
  useCustomCompletion: (props?: CommandListProps) => UseCompletionHelpers;
}

export const NovelContext = createContext<NovelContextValue>({
  lastTextKey: '++',
  completionApi: "/api/generate",
  feedbackCallback: () => { },
  useCustomCompletion: (...props) => ({} as UseCompletionHelpers),
});

