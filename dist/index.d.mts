import * as react from 'react';
import { ReactNode } from 'react';
import { Editor as Editor$1, Range, Extensions } from '@tiptap/core';
import { JSONContent } from '@tiptap/react';
import { UseCompletionHelpers } from 'ai/react';
import { EditorProps } from '@tiptap/pm/view';
import { UseCompletionHelpers as UseCompletionHelpers$1 } from 'ai/react/dist';

interface CommandItemProps {
    title: string;
    description: string;
    icon: ReactNode;
}
interface CommandProps {
    editor: Editor$1;
    range: Range;
}
interface CommandListProps {
    items: CommandItemProps[];
    command: any;
    editor: any;
    range: any;
}

declare function Editor({ completionApi, className, defaultValue, extensions, editorProps, onUpdate, onDebouncedUpdate, debounceDuration, storageKey, disableLocalStorage, grabEditor, useCustomCompletion, lastTextKey, disableHistory, feedbackCallback, isFetching, Loader, }: {
    /**
     * The API route to use for the OpenAI completion API.
     * Defaults to "/api/generate".
     */
    completionApi?: string;
    /**
     * Additional classes to add to the editor container.
     * Defaults to "relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg".
     */
    className?: string;
    /**
     * The default value to use for the editor.
     * Defaults to defaultEditorContent.
     */
    defaultValue?: JSONContent | string;
    /**
     * A list of extensions to use for the editor, in addition to the default Novel extensions.
     * Defaults to [].
     */
    extensions?: Extensions;
    /**
     * Props to pass to the underlying Tiptap editor, in addition to the default Novel editor props.
     * Defaults to {}.
     */
    editorProps?: EditorProps;
    /**
     * A callback function that is called whenever the editor is updated.
     * Defaults to () => {}.
     */
    onUpdate?: (editor?: Editor$1) => void | Promise<void>;
    /**
     * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
     * Defaults to () => {}.
     */
    onDebouncedUpdate?: (editor: Editor$1 | null) => void | Promise<void>;
    /**
     * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
     * Defaults to 750.
     */
    debounceDuration?: number;
    /**
     * The key to use for storing the editor's value in local storage.
     * Defaults to "novel__content".
     */
    storageKey?: string;
    /**
     * Disable local storage read/save.
     * Defaults to false.
     */
    disableLocalStorage?: boolean;
    useCustomCompletion?: (props?: CommandListProps) => UseCompletionHelpers;
    grabEditor?: (editor: Editor$1) => void;
    lastTextKey?: string;
    disableHistory?: boolean;
    feedbackCallback?: () => void;
    isFetching?: boolean;
    Loader?: JSX.Element;
}): JSX.Element;

declare const NovelContext: react.Context<{
    lastTextKey: string;
    completionApi: string;
    feedbackCallback: () => void;
    useCustomCompletion: (props?: CommandListProps) => UseCompletionHelpers$1;
}>;

export { CommandItemProps, CommandListProps, CommandProps, Editor, NovelContext };
