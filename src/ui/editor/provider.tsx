"use client";

import { UseCompletionOptions } from "ai";
import { UseCompletionHelpers } from "ai/react/dist";
import { createContext } from "react";
import { CommandListProps } from "./interface";


export const NovelContext = createContext<{
  lastTextKey: string;
  completionApi: string;
  feedbackCallback: () => void;
  useCustomCompletion: (props?: CommandListProps) => UseCompletionHelpers;
}>({
  lastTextKey: '++',
  completionApi: "/api/generate",
  feedbackCallback: () => { },
  useCustomCompletion: (...props) => ({} as UseCompletionHelpers),
});
