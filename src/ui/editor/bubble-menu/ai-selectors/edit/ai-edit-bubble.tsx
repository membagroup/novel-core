import LoadingDots from "@/ui/icons/loading-dots";
import Magic from "@/ui/icons/magic";
import { Editor } from "@tiptap/core";
import { useCompletion } from "ai/react";
import { X, Clipboard, Replace, Repeat } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
// import va from "@vercel/analytics";
import { NovelContext } from "../../../provider";
import ReactMarkdown from "react-markdown";
import { useClickOutside } from "@/ui/editor/hooks";

type Props = {
  editor: Editor;
};

const AIEditorBubble: React.FC<Props> = ({ editor }: Props) => {
  const [isShow, setIsShow] = useState(false);

  const { completionApi, additionalData: { body, headers } } = useContext(NovelContext);

  const {
    completion: editCompletion, setCompletion: setEditCompletion,
    isLoading: isEditLoading, stop: stopEdit, complete: completeEdit,
  } = useCompletion({
    id: "ai-edit",
    api: `${completionApi}/edit`,
    body: { ...(body || {}) },
    headers: { ...(headers || {}), },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const {
    completion: draftCompletion, setCompletion: setDraftCompletion,
    isLoading: isDraftLoading, stop: stopDraft, // complete: completeDraft,
  } = useCompletion({
    id: "ai-draft",
    api: `${completionApi}/draft`,
    body: { ...(body || {}) },
    headers: { ...(headers || {}), },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const isEdit = !!editCompletion;

  const completion = isEdit ? editCompletion : draftCompletion;
  const isLoading = isEdit ? isEditLoading : isDraftLoading;
  // const complete = isEdit ? completeEdit : completeDraft;
  const stop = isEdit ? stopEdit : stopDraft;
  const setCompletion = isEdit ? setEditCompletion : setDraftCompletion;

  useEffect(() => {
    if (completion.length > 0) {
      setIsShow(true);
    }
  }, [completion]);

  const handleCopy = () => {
    navigator.clipboard.writeText(completion);
    toast.message("Copied to clipboard");
    handleClose();
  };

  const handleReplace = () => {
    if (completion.length > 0) {
      const { from, to } = editor.state.selection;
      editor.commands.insertContent(completion, {
        updateSelection: true,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsShow(false);
    setCompletion("");
  }

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => {
    if (!isShow) return;
    handleCopy();
  });

  return isShow || isLoading ? (
    <div ref={ref} className="novel-fixed novel-z-[10000] novel-bottom-3 novel-right-3 novel-p-3 novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-shadow-xl novel-animate-in novel-fade-in novel-slide-in-from-bottom-1">
      <div className="novel-w-64 novel-max-h-48 novel-overflow-y-auto">
        <div className=" novel-flex novel-gap-2 novel-items-center novel-text-slate-500">
          <Magic className="novel-h-5 novel-animate-pulse novel-w-5 novel-text-purple-500" />
          {isLoading && (
            <div
              className="novel-mr-auto novel-flex novel-items-center"
              onClick={() => { stop(); }}
            >
              <LoadingDots color="#9e9e9e" />
            </div>
          )}

          <div className="novel-flex novel-items-center novel-ml-auto gap-2">
            <button>
              <Replace
                onClick={handleReplace}
                className="novel-w-4 novel-h-4 novel-cursor-pointer hover:novel-text-slate-300 "
              />
            </button>
            <button>
              <Clipboard
                onClick={handleCopy}
                className="novel-w-4 active:novel-text-green-500 novel-h-4 novel-cursor-pointer hover:novel-text-slate-300 "
              />
            </button>
            <button>
              <Repeat
                onClick={() => {
                  const command = 'Rewrite the text';
                  const prevResponse = completion;
                  completeEdit(`${command}:\n ${prevResponse}`, { body: { prevResponse, command, } });
                }}
                className="novel-w-4 novel-h-4 novel-cursor-pointer hover:novel-text-slate-300 "
              />
            </button>
            <X
              onClick={() => {
                handleClose();
              }}
              className="novel-w-4 novel-h-4 novel-cursor-pointer hover:novel-text-slate-300 "
            />
          </div>
        </div>

        {completion.length > 0 && (
          <ReactMarkdown className="novel-text-sm mt-2">
            {completion}
          </ReactMarkdown>
        )}
      </div>
    </div>
  ) : null;
};

export default AIEditorBubble;
