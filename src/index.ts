import "./styles/index.css";
import "./styles/tailwind.css";
import "./styles/prosemirror.css";
import { NovelContextType } from "./ui/editor/provider";

export * from "./ui/editor/interfaces";
export { default as Editor } from "./ui/editor";
export type { NovelContextType };