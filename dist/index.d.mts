import { JSONContent } from '@tiptap/react';
import { EditorProps } from '@tiptap/pm/view';
import { Extensions, Editor as Editor$1 } from '@tiptap/core';

declare function Editor({ completionApi, className, defaultValue, extensions, editorProps, onUpdate, onDebouncedUpdate, debounceDuration, storageKey, disableLocalStorage, editable, bot, collaboration, id, userName, }: {
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
     * A list of extensions to use for the editor, in addition to the default inke extensions.
     * Defaults to [].
     */
    extensions?: Extensions;
    /**
     * Props to pass to the underlying Tiptap editor, in addition to the default inke editor props.
     * Defaults to {}.
     */
    editorProps?: EditorProps;
    /**
     * A callback function that is called whenever the editor is updated.
     * Defaults to () => {}.
     */
    onUpdate?: (editor?: Editor$1) => void;
    /**
     * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
     * Defaults to () => {}.
     */
    onDebouncedUpdate?: (json: JSONContent, text: string, markdown: string, editor: Editor$1) => void;
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
    /**
     * Enable editing.
     * Defaults to true.
     */
    editable?: boolean;
    /**
     * Bot: chat with note.
     * Defaults to false.
     */
    bot?: boolean;
    /**
     * Id: collaboration room id.
     */
    id?: string;
    /**
     * Collaboration: enable collaboration space.
     * Defaults to false.
     */
    collaboration?: boolean;
    /**
     * userName: collaboration userName.
     */
    userName?: string;
}): JSX.Element;

export { Editor };
