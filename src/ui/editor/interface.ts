import React, { ReactNode, } from "react";
import { Editor, Range } from "@tiptap/core";

export interface CommandItemProps {
    title: string;
    description: string;
    icon: ReactNode;
}

export interface CommandProps {
    editor: Editor;
    range: Range;
}

export interface CommandListProps {
    items: CommandItemProps[];
    command: any;
    editor: any;
    range: any;
}