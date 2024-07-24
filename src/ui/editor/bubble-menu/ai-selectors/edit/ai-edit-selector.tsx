import { Editor } from "@tiptap/core";
import {
  Beef,
  Book,
  Check,
  CheckCheck,
  ChevronDown,
  Heading1,
  LayoutPanelTop,
  ListMinus,
  ListPlus,
  PartyPopper,
  PauseCircle,
  Scissors,
  Send,
  Bot,
  Trash,
  Wand,
  LucideIcon,
} from "lucide-react";
import React, { FC, SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import { Command } from "cmdk";
import Magic from "@/ui/icons/magic";
import { useCompletion } from "ai/react";
import { NovelContext } from "../../../provider";
import { toast } from "sonner";
import { AIMenuItem } from "@/ui/editor/interfaces";
import { useClickOutside } from "@/ui/editor/hooks";
import Magic1 from "@/ui/icons/magic-1";

interface AISelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  hasSelection?: boolean;
  subMenuItems?: AIMenuItem[]
}

export const AISelector: FC<AISelectorProps> = (props: AISelectorProps) => {
  const { editor, isOpen, setIsOpen, hasSelection, subMenuItems } = props;
  // const context = useContext(NovelContext);

  const inputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState<Record<string, any>>({});

  const defaultItems = [
    {
      name: "Improve selection",
      command: "Improve writing",
      icon: Wand,
    },
    {
      name: "Fix spelling & grammar",
      command:
        "Please correct spelling and grammar errors in the following text",
      icon: CheckCheck,
    },
    {
      name: "Make shorter",
      command: "Make shorter",
      icon: ListMinus,
    },
    {
      name: "Make longer",
      command: "Make longer",
      icon: ListPlus,
    },
    {
      name: "Writing suggestions",
      command: "Provide suggestions and improvements for the writing",
      icon: Beef,
    },
    {
      name: "Enhance vocabulary",
      command: "Suggest synonyms and expand vocabulary usage",
      icon: Book,
    },
    {
      name: "Generate titles",
      command: "Automatically generate compelling titles for the content",
      icon: Heading1,
    },
    {
      name: "Templates & structure",
      command:
        "Offer templates and structure suggestions to improve the writing organization",
      icon: LayoutPanelTop,
    },
    {
      name: "Fix repetitive",
      command: "Identify and fix repetitive words or phrases in the content",
      icon: Scissors,
    },
  ];

  const items = [
    ...defaultItems,
    ...(subMenuItems || []),
  ] as AIMenuItem[];

  const handleSubmit = () => {
    if (!options?.command) return;
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");
    complete(`${options?.command}:\n ${text}`, { body: { ...options, text } });
    setOptions({});
    setIsOpen(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "Enter" && inputRef?.current) {
          handleSubmit();
        }
      }
      else if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
        stop();
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", onKeyDown);
    } else {
      document.removeEventListener("keydown", onKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    if (!isOpen) return;
    setIsOpen(false);
  });

  // useEffect(() => {
  //   if (!hasSelection) inputRef.current && inputRef.current?.focus();
  // });

  const { completionApi, additionalData: { body, headers, aiSelectorTitle } } = useContext(NovelContext);

  const { complete, isLoading, stop } = useCompletion({
    id: "ai-edit",
    api: `${completionApi}/edit`,
    body: { ...(body || {}) },
    headers: { ...(headers || {}), },
  });

  // https://github.com/pacocoursey/cmdk?tab=readme-ov-file#nested-items

  return (
    <div className="novel-flex" ref={ref}>
      <div className={`novel-flex novel-h-full novel-items-center novel-gap-1 novel-text-sm novel-font-medium hover:novel-bg-stone-100 active:novel-bg-stone-200 ${isOpen ? 'novel-text-purple-500' : 'novel-text-stone-600'}`}>
        <button
          className="novel-p-2 novel-flex novel-h-full novel-items-center novel-gap-2"
          onClick={() => {
            if (isLoading) {
              stop();
            }
            setIsOpen(!isOpen);
            editor.chain().blur().run();
          }}>
          <Magic1 className="novel-h-5 novel-w-5" /> {aiSelectorTitle || 'AI'}
          {isLoading ? (
            <PauseCircle
              onClick={stop}
              className="novel-h-4 hover:novel-text-stone-500 cursor-pointer novel-w-4 novel-text-stone-300"
            />
          ) : (
            <ChevronDown className="novel-h-4 novel-w-4" />
          )}
        </button>
      </div>

      {isOpen && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="novel-fixed novel-top-full novel-z-[99999] novel-mt-1 novel-w-full novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-p-1 novel-shadow-xl novel-animate-in novel-fade-in novel-slide-in-from-top-1 novel-flex novel-flex-col">
            <div className="novel-flex novel-w-full">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter a prompt or question..."
                className="novel-flex-1 novel-bg-white novel-p-1 novel-text-sm novel-outline-none novel-text-slate-500"
                value={options?.command || ''}
                onChange={(e) => {
                  let value = e.currentTarget.value;
                  setOptions({ ...options, command: value });
                }}
              />
              <button type="submit" className="novel-flex novel-items-center novel-rounded-sm novel-p-1 novel-text-stone-600 novel-transition-all hover:novel-bg-stone-100">
                <Send className="novel-h-4 novel-w-4 novel-text-purple-500" />
              </button>
            </div>
            <textarea
              placeholder="Enter additional info..."
              className="flex-1 bg-white p-1 text-sm border rounded text-slate-500"
              value={options?.info || ''}
              onChange={(e) => {
                let value = e.currentTarget.value;
                setOptions({ ...options, info: value });
              }}
            />
          </form>
          {
            <Command className="novel-fixed novel-top-full novel-z-[99999] novel-mt-[6rem] novel-w-60 novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-p-2 novel-shadow-xl novel-animate-in novel-fade-in novel-slide-in-from-top-1">
              <Command.List>
                <Command.Group heading="Requires Text Selection" className="novel-text-slate-400">
                  {items?.filter(i => i?.visible !== false)?.map((item, index) => (
                    <Command.Item
                      key={index}
                      disabled={!hasSelection}
                      onSelect={() => {
                        if (!hasSelection) return;
                        if (!isLoading) {
                          const { from, to } = editor.state.selection;
                          const text = editor.state.doc.textBetween(from, to, " ");
                          complete(`${item.command}:\n ${text}`, { body: { ...options, command: item.command, text } });
                          setIsOpen(false);
                        }
                      }}
                      className={`novel-flex group novel-items-center novel-justify-between novel-rounded-sm novel-px-2 novel-py-1 novel-text-sm novel-text-gray-600 active:novel-bg-stone-200 aria-selected:novel-bg-stone-100 ${!hasSelection ? 'novel-cursor-default' : 'novel-cursor-pointer'}`}>
                      <div className="novel-flex novel-items-center novel-space-x-2">
                        <item.icon className="novel-h-4 novel-w-4 novel-text-purple-500" />
                        <span>{item.name}</span>
                      </div>
                      {/* <CornerDownLeft className="novel-hidden novel-h-4 novel-w-4 group-hover:novel-block" /> */}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          }
        </>
      )}
    </div>
  );
};
