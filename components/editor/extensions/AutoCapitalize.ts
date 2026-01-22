import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const AutoCapitalize = Extension.create({
    name: 'autoCapitalize',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('autoCapitalize'),
                props: {
                    handleTextInput: (view, from, to, text) => {
                        const { state } = view;
                        const $from = state.doc.resolve(from);

                        // Check if we are at the start of a node (paragraph, etc.)
                        const isStartOfNode = $from.parentOffset === 0;

                        // Check previous characters to see if we follow a sentence end
                        const previousChar = $from.parent.textBetween(Math.max(0, $from.parentOffset - 2), $from.parentOffset, undefined, ' ');

                        // Check for sentence terminators followed by a space
                        const isSentenceStart = /[.!?]\s$/.test(previousChar);

                        // Simple check: is this the very first character in the doc?
                        // or start of a new block?
                        // or follows ". " "? " "! "

                        if (isStartOfNode || isSentenceStart) {
                            const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
                            view.dispatch(view.state.tr.insertText(capitalized, from, to));
                            return true; // handled
                        }

                        return false;
                    },
                },
            }),
        ];
    },
});
