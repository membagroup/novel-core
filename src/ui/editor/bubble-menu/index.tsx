import { BubbleMenu, BubbleMenuProps, isNodeSelection } from "@tiptap/react";
import { FC, ReactElement, ReactNode, useContext, useEffect, useRef, useState } from "react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
} from "lucide-react";
import { NodeSelector } from "./node-selector";
import { ColorSelector } from "./color-selector";
import { LinkSelector } from "./link-selector";
import { cn } from "@/lib/utils";
import { TableSelector } from "./table-selector";
import { AISelector } from "./ai-selectors/edit/ai-edit-selector";
import { TranslateSelector } from "./ai-selectors/translate/ai-translate-selector";
import { NovelContext } from "../provider";
import React from "react";
import { AIMenuItem, BubbleMenuItem } from "../interfaces";

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">
// & { panelOpen?: boolean };

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
  const { additionalData, showBubbleMenu } = useContext(NovelContext);
  const { showLinkSelector, menuItems, aiMenuItems, customMenuItems } = additionalData;
  const bubbleMenuItems = (menuItems || []) as BubbleMenuItem[];
  const CustomMenuItems = (customMenuItems || []) as {
    component: (props: any) => JSX.Element, isOpen: boolean, setIsOpen: (value: React.SetStateAction<boolean>) => void
  }[];

  const items: BubbleMenuItem[] = [
    {
      name: "bold",
      isActive: () => props.editor!.isActive("bold"),
      command: () => props.editor!.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: "italic",
      isActive: () => props.editor!.isActive("italic"),
      command: () => props.editor!.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: "underline",
      isActive: () => props.editor!.isActive("underline"),
      command: () => props.editor!.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: "strike",
      isActive: () => props.editor!.isActive("strike"),
      command: () => props.editor!.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: "code",
      isActive: () => props.editor!.isActive("code"),
      command: () => props.editor!.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
    ...bubbleMenuItems,
  ];

  const bubbleMenuProps: EditorBubbleMenuProps = {
    ...props,
    shouldShow: ({ state, editor }) => {
      const { selection } = state;
      const { empty } = selection;
      setHasSection(!empty);
      // don't show bubble menu if:
      // - the selected node is an image
      // - the selection is empty
      // - the selection is a node selection (for drag handles)
      if (editor.isActive("image") || isNodeSelection(selection)) {
        return false;
      }
      // https://github.com/ueberdosis/tiptap/issues/2305
      return true;
    },
    tippyOptions: {
      // https://atomiks.github.io/tippyjs/v6/all-props/#placement
      placement: 'bottom',
      moveTransition: "transform 0.15s ease-out",
      onHidden: () => {
        setIsNodeSelectorOpen(false);
        setIsColorSelectorOpen(false);
        setIsLinkSelectorOpen(false);
        setIsTableSelectorOpen(false);
        setIsAISelectorOpen(false);
        setIsTranslateSelectorOpen(false);
      },
      // hide tippy if not showBubbleMenu
      arrow: false,
      // followCursor: showBubbleMenu,
    },
  };

  const [hasSelection, setHasSection] = useState(false);
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
  const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);
  const [isAISelectorOpen, setIsAISelectorOpen] = useState(false);
  const [isTranslateSelectorOpen, setIsTranslateSelectorOpen] = useState(false);

  return (
    <BubbleMenu
      {...bubbleMenuProps}
      className={`novel-flex novel-w-fit novel-max-w-[97vw] novel-overflow-x-auto novel-divide-x novel-divide-stone-200 novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-shadow-xl`}>
      {props.editor && showBubbleMenu && (
        <>
          <AISelector
            editor={props.editor}
            isOpen={isAISelectorOpen}
            hasSelection={hasSelection}
            subMenuItems={aiMenuItems || []}
            setIsOpen={() => {
              setIsAISelectorOpen(!isAISelectorOpen);
              setIsNodeSelectorOpen(false);
              setIsColorSelectorOpen(false);
              setIsTableSelectorOpen(false);
              setIsLinkSelectorOpen(false);
              setIsTranslateSelectorOpen(false);
            }}
          />
          <NodeSelector
            editor={props.editor}
            isOpen={isNodeSelectorOpen}
            setIsOpen={() => {
              setIsNodeSelectorOpen(!isNodeSelectorOpen);
              setIsColorSelectorOpen(false);
              setIsTableSelectorOpen(false);
              setIsLinkSelectorOpen(false);
              setIsAISelectorOpen(false);
              setIsTranslateSelectorOpen(false);
            }}
          />
          {props.editor.isActive("table") && (
            <TableSelector
              editor={props.editor}
              isOpen={isTableSelectorOpen}
              setIsOpen={() => {
                setIsTableSelectorOpen(!isTableSelectorOpen);
                setIsColorSelectorOpen(false);
                setIsNodeSelectorOpen(false);
                setIsLinkSelectorOpen(false);
                setIsAISelectorOpen(false);
                setIsTranslateSelectorOpen(false);
              }}
            />
          )}
          {showLinkSelector !== false ? <LinkSelector
            editor={props.editor}
            isOpen={isLinkSelectorOpen}
            setIsOpen={() => {
              setIsLinkSelectorOpen(!isLinkSelectorOpen);
              setIsColorSelectorOpen(false);
              setIsTableSelectorOpen(false);
              setIsNodeSelectorOpen(false);
              setIsAISelectorOpen(false);
              setIsTranslateSelectorOpen(false);
            }}
          /> : null}
          <div className="novel-flex">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={item.command}
                className="novel-p-2 novel-text-stone-600 hover:novel-bg-stone-100 active:novel-bg-stone-200"
                type="button">
                <item.icon
                  className={cn("novel-h-4 novel-w-4", {
                    "novel-text-purple-500": item.isActive(),
                  })}
                />
              </button>
            ))}
          </div>
          <ColorSelector
            editor={props.editor}
            isOpen={isColorSelectorOpen}
            setIsOpen={() => {
              setIsColorSelectorOpen(!isColorSelectorOpen);
              setIsTableSelectorOpen(false);
              setIsNodeSelectorOpen(false);
              setIsLinkSelectorOpen(false);
              setIsAISelectorOpen(false);
              setIsTranslateSelectorOpen(false);
            }}
          />
          {hasSelection ? <TranslateSelector
            editor={props.editor}
            isOpen={isTranslateSelectorOpen}
            setIsOpen={() => {
              setIsTranslateSelectorOpen(!isTranslateSelectorOpen);
              setIsAISelectorOpen(false);
              setIsNodeSelectorOpen(false);
              setIsColorSelectorOpen(false);
              setIsTableSelectorOpen(false);
              setIsLinkSelectorOpen(false);
            }}
          /> : null}
          {CustomMenuItems.length ?
            CustomMenuItems.map((item, index) => (
              //  React.cloneElement(item, { key: index })
              <item.component
                key={index}
                context={NovelContext}
                editor={props.editor}
                isOpen={item?.isOpen}
                setIsOpen={() => {
                  item.setIsOpen(!item.isOpen);
                  setIsTranslateSelectorOpen(false);
                  setIsAISelectorOpen(false);
                  setIsNodeSelectorOpen(false);
                  setIsColorSelectorOpen(false);
                  setIsTableSelectorOpen(false);
                  setIsLinkSelectorOpen(false);
                }}
              />
            )) : null
          }
        </>
      )}
    </BubbleMenu>
  );
};
