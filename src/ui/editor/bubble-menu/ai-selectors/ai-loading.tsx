import { Magic } from "@/ui/icons";
import { PauseCircle } from "lucide-react";

export default function AIGeneratingLoading({ stop }: { stop: () => void }) {
  return (
    <div className="novel-flex novel-items-center novel-justify-start novel-bg-white novel-shadow-lg novel-rounded-full novel-px-3 novel-py-2 novel-w-16 novel-h-10">
      <Magic className="novel-w-7 novel-animate-pulse novel-text-purple-500" />
      <span className="novel-text-sm novel-animate-pulse novel-ml-1 novel-text-slate-500">
        generating...
      </span>
      <PauseCircle
        onClick={stop}
        className="novel-h-5 hover:novel-text-stone-500 novel-cursor-pointer novel-ml-6 novel-w-5 novel-text-stone-300"
      />
    </div>
  );
}
