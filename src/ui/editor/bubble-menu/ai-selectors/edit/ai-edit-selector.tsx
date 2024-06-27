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
  SprayCan,
  Trash,
  Wand,
} from "lucide-react";
import { FC, useContext, useEffect, useRef } from "react";
import { Command } from "cmdk";
import Magic from "@/ui/icons/magic";
import { useCompletion } from "ai/react";
import { NovelContext } from "../../../provider";
import { toast } from "sonner";

interface AISelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const AISelector: FC<AISelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const items = [
    {
      name: "Improve writing",
      detail: "Improve writing",
      icon: Wand,
    },
    {
      name: "Fix spelling & grammar",
      detail:
        "Please correct spelling and grammar errors in the following text",
      icon: CheckCheck,
    },
    {
      name: "Make shorter",
      detail: "Make shorter",
      icon: ListMinus,
    },
    {
      name: "Make longer",
      detail: "Make longer",
      icon: ListPlus,
    },
    {
      name: "Writing suggestions",
      detail: "Provide suggestions and improvements for the writing",
      icon: Beef,
    },
    {
      name: "Enhance vocabulary",
      detail: "Suggest synonyms and expand vocabulary usage",
      icon: Book,
    },
    {
      name: "Generate titles",
      detail: "Automatically generate compelling titles for the content",
      icon: Heading1,
    },
    {
      name: "Templates & structure",
      detail:
        "Offer templates and structure suggestions to improve the writing organization",
      icon: LayoutPanelTop,
    },
    {
      name: "Fix repetitive",
      detail: "Identify and fix repetitive words or phrases in the content",
      icon: Scissors,
    },
  ];

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
        e.preventDefault();
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

  const { completionApi, plan } = useContext(NovelContext);

  const { complete, isLoading, stop } = useCompletion({
    id: "ai-edit",
    api: `${completionApi}/edit`,
    body: { plan },
  });

  return (
    <div className="novel-relative novel-h-full">
      <div className="novel-flex novel-h-full novel-items-center novel-gap-1 novel-text-sm novel-font-medium novel-text-cyan-500 hover:novel-bg-stone-100 active:novel-bg-stone-200">
        <button
          className="novel-p-2 novel-flex novel-h-full novel-items-center novel-gap-2"
          onClick={() => {
            if (isLoading) {
              stop();
            }
            setIsOpen(!isOpen);
            editor.chain().blur().run();
          }}>
          <SprayCan className="novel-h-5 novel-w-5" />
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
              if (!input.value) return;
              const { from, to } = editor.state.selection;
              const text = editor.state.doc.textBetween(from, to, " ");
              complete(`${input.value}:\n ${text}`);
              setIsOpen(false);
            }}
            className="novel-fixed novel-top-full novel-z-[99999] novel-mt-1 novel-flex novel-w-full novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-p-1 novel-shadow-xl novel-animate-in novel-fade-in novel-slide-in-from-top-1">
            <input
              ref={inputRef}
              type="text"
              placeholder="Make this para funnier..."
              className="novel-flex-1 novel-bg-white novel-p-1 novel-text-sm novel-outline-none"
              defaultValue={editor.getAttributes("link").href || ""}
            />
            <button className="novel-flex novel-items-center novel-rounded-sm novel-p-1 novel-text-stone-600 novel-transition-all hover:novel-bg-stone-100">
              <Send className="novel-h-4 novel-w-4 novel-text-cyan-500" />
            </button>
          </form>
          <Command className="novel-fixed novel-top-full novel-z-[99999] novel-mt-[46.5px] novel-w-60 novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-p-2 novel-shadow-xl novel-animate-in novel-fade-in novel-slide-in-from-top-1">
            <Command.List>
              {items.map((item, index) => (
                <Command.Item
                  key={index}
                  onSelect={() => {
                    if (!isLoading) {
                      const { from, to } = editor.state.selection;
                      const text = editor.state.doc.textBetween(from, to, " ");
                      complete(`${item.detail}:\n ${text}`);
                      setIsOpen(false);
                    }
                  }}
                  className="novel-flex group novel-cursor-pointer novel-items-center novel-justify-between novel-rounded-sm novel-px-2 novel-py-1 novel-text-sm novel-text-gray-600 active:novel-bg-stone-200 aria-selected:novel-bg-stone-100">
                  <div className="novel-flex novel-items-center novel-space-x-2">
                    <item.icon className="novel-h-4 novel-w-4 novel-text-cyan-500" />
                    <span>{item.name}</span>
                  </div>
                  {/* <CornerDownLeft className="novel-hidden novel-h-4 novel-w-4 group-hover:novel-block" /> */}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </>
      )}
    </div>
  );
};
