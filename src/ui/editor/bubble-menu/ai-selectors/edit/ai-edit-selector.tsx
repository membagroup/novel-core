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
import React, { FC, useContext, useEffect, useRef } from "react";
import { Command } from "cmdk";
import Magic from "@/ui/icons/magic";
import { useCompletion } from "ai/react";
import { NovelContext } from "../../../provider";
import { toast } from "sonner";

export interface AIMenuItem { name: string; command: string, icon: LucideIcon };

interface AISelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showSubmenu?: boolean;
  subMenuItems?: AIMenuItem[]
}

export const AISelector: FC<AISelectorProps> = (props: AISelectorProps) => {
  const { editor, isOpen, setIsOpen, showSubmenu, subMenuItems } = props;

  const items = [
    {
      name: "Improve writing",
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
    ...(subMenuItems || []),
  ];

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (input: HTMLInputElement) => {
    if (!input.value) return;
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");
    complete(`${input.value}:\n ${text}`);
    setIsOpen(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
        e.preventDefault();
        if (e.key === "Enter" && inputRef?.current) {
          handleSubmit(inputRef.current);
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

  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  const { completionApi, additionalData: { body, headers } } = useContext(NovelContext);

  const { complete, isLoading, stop } = useCompletion({
    id: "ai-edit",
    api: `${completionApi}/edit`,
    body: { ...(body || {}) },
    headers: { ...(headers || {}), },
  });

  return (
    <div className="novel-relative novel-h-full">
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
          <Bot className="novel-h-5 novel-w-5" />
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
              const input = e.currentTarget[0] as HTMLInputElement;
              handleSubmit(input);
            }}
            className="novel-fixed novel-top-full novel-z-[99999] novel-mt-1 novel-flex novel-w-full novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-p-1 novel-shadow-xl novel-animate-in novel-fade-in novel-slide-in-from-top-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a prompt or question..."
              className="novel-flex-1 novel-bg-white novel-p-1 novel-text-sm novel-outline-none novel-text-slate-500"
              defaultValue={editor.getAttributes("link").href || ""}
            />
            <button className="novel-flex novel-items-center novel-rounded-sm novel-p-1 novel-text-stone-600 novel-transition-all hover:novel-bg-stone-100">
              <Send className="novel-h-4 novel-w-4 novel-text-purple-500" />
            </button>
          </form>
          {showSubmenu ?
            <Command className="novel-fixed novel-top-full novel-z-[99999] novel-mt-[46.5px] novel-w-60 novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-p-2 novel-shadow-xl novel-animate-in novel-fade-in novel-slide-in-from-top-1">
              <Command.List>
                {items.map((item, index) => (
                  <Command.Item
                    key={index}
                    onSelect={() => {
                      if (!isLoading) {
                        const { from, to } = editor.state.selection;
                        const text = editor.state.doc.textBetween(from, to, " ");
                        complete(`${item.command}:\n ${text}`);
                        setIsOpen(false);
                      }
                    }}
                    className="novel-flex group novel-cursor-pointer novel-items-center novel-justify-between novel-rounded-sm novel-px-2 novel-py-1 novel-text-sm novel-text-gray-600 active:novel-bg-stone-200 aria-selected:novel-bg-stone-100">
                    <div className="novel-flex novel-items-center novel-space-x-2">
                      <item.icon className="novel-h-4 novel-w-4 novel-text-purple-500" />
                      <span>{item.name}</span>
                    </div>
                    {/* <CornerDownLeft className="novel-hidden novel-h-4 novel-w-4 group-hover:novel-block" /> */}
                  </Command.Item>
                ))}
              </Command.List>
            </Command> : null
          }
        </>
      )}
    </div>
  );
};
