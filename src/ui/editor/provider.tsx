"use client";

import { createContext } from "react";

export interface NovelContextType {
  completionApi: string;
  additionalData: Record<string, any>;
  lastInput: string;
  setLastInput: (text: string) => void; // https://stackoverflow.com/a/64517088
  showBubbleMenu: boolean;
  setShowBubbleMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NovelContext = createContext<NovelContextType>({
  completionApi: "/api/generate",
  additionalData: {},
  lastInput: '',
  setLastInput: (text) => { },
  showBubbleMenu: true,
  setShowBubbleMenu: () => { },
});
