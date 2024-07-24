import LoadingDots from "@/ui/icons/loading-dots";
import Magic from "@/ui/icons/magic";
import { Editor } from "@tiptap/core";
import { useCompletion } from "ai/react";
import { X, Clipboard, Replace, Repeat } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
// import va from "@vercel/analytics";
import { NovelContext } from "../../../provider";
import ReactMarkdown from "react-markdown";

type Props = {
  editor: Editor;
};

const AIEditorBubble: React.FC<Props> = ({ editor }: Props) => {
  const [isShow, setIsShow] = useState(false);

  const { completionApi, additionalData: { body, headers } } = useContext(NovelContext);

  const { completion: editCompletion, setCompletion: setEditCompletion, isLoading: isEditLoading, stop: stopEdit, complete: completeEdit, input: editInput } = useCompletion({
    id: "ai-edit",
    api: `${completionApi}/edit`,
    body: { ...(body || {}) },
    headers: { ...(headers || {}), },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { completion: draftCompletion, setCompletion: setDraftCompletion, isLoading: isDraftLoading, stop: stopDraft, complete: completeDraft, input: draftInput } = useCompletion({
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
  const input = isEdit ? editInput : draftInput;
  const complete = isEdit ? completeEdit : completeDraft;
  const stop = isEdit ? stopEdit : stopDraft;
  const setCompletion = isEdit ? setEditCompletion : setDraftCompletion;

  useEffect(() => {
    if (completion.length > 0) {
      setIsShow(true);
    }
  }, [completion]);

  const handleCopy = () => {
    navigator.clipboard.writeText(completion);
  };

  const handleReplace = () => {
    if (completion.length > 0) {
      const { from, to } = editor.state.selection;
      editor.commands.insertContent(completion, {
        updateSelection: true,
      });
    }
  };

  return isShow || isLoading ? (
    <div className="novel-fixed novel-z-[10000] novel-bottom-3 novel-right-3 novel-p-3 novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-shadow-xl novel-animate-in novel-fade-in novel-slide-in-from-bottom-1">
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
                  const inputSplit = input.split(':\n');
                  complete(input, { body: { prevResponse: completion, command: inputSplit[0], text: inputSplit[1] || '' } });
                }}
                className="novel-w-4 novel-h-4 novel-cursor-pointer hover:novel-text-slate-300 "
              />
            </button>
            <X
              onClick={() => {
                setIsShow(false);
                setCompletion("");
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
