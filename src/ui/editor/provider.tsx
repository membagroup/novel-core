"use client";

import { createContext } from "react";

export const NovelContext = createContext<{
  completionApi: string;
  additionalData: Record<string, any>;
  lastInput: string;
  setLastInput: (text: string) => void; // https://stackoverflow.com/a/64517088
  showBubbleMenu: boolean | undefined;
  setShowBubbleMenu: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}>({
  completionApi: "/api/generate",
  additionalData: {},
  lastInput: '',
  setLastInput: (text) => { },
  showBubbleMenu: undefined,
  setShowBubbleMenu: () => { },
});
