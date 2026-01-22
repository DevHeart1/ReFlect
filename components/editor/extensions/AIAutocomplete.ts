import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { generateSentenceCompletion } from '../../../services/geminiService';

export const AIAutocomplete = Extension.create({
    name: 'aiAutocomplete',

    addProseMirrorPlugins() {
        let debounceTimer: ReturnType<typeof setTimeout> | null = null;
        let suggestion = '';
        let decorationSet = DecorationSet.empty;
        let isFetching = false;

        return [
            new Plugin({
                key: new PluginKey('aiAutocomplete'),
                state: {
                    init() {
                        return DecorationSet.empty;
                    },
                    apply(tr, value) {
                        // If the content changed (user typed), clear the suggestion immediately
                        if (tr.docChanged) {
                            suggestion = '';
                            return DecorationSet.empty;
                        }
                        // If it's just our decoration transaction, update the decorations
                        if (tr.getMeta('aiAutocomplete')) {
                            return tr.getMeta('aiAutocomplete');
                        }
                        return value;
                    }
                },
                props: {
                    decorations(state) {
                        return this.getState(state);
                    },
                    handleKeyDown(view, event) {
                        if (event.key === 'Tab' && suggestion) {
                            event.preventDefault();
                            view.dispatch(view.state.tr.insertText(' ' + suggestion)); // Add space for safety or assume natural flow? 
                            // Usually spaces are handled by the user or the suggestion.
                            // Let's assume the suggestion might lack a leading space if it continues a word, 
                            // or have one if it's new.
                            // For simplicity, we just insert.

                            suggestion = '';
                            view.dispatch(view.state.tr.setMeta('aiAutocomplete', DecorationSet.empty));
                            return true;
                        }
                        return false;
                    },
                    handleTextInput(view, from, to, text) {
                        // Clear existing timer
                        if (debounceTimer) clearTimeout(debounceTimer);

                        // Set new timer
                        debounceTimer = setTimeout(async () => {
                            // Don't fetch if already fetching or if selection is not empty/at end
                            const { state } = view;
                            const { selection } = state;

                            // Only trigger at the end of a block/text node for simplicity to avoid chaos
                            // or anywhere.

                            const context = state.doc.textBetween(Math.max(0, selection.from - 100), selection.from, '\n', ' ');
                            if (context.length < 5) return; // Need some context

                            isFetching = true;
                            try {
                                const result = await generateSentenceCompletion(context);
                                if (result) {
                                    suggestion = result;
                                    // Create decoration
                                    const div = document.createElement('span');
                                    div.textContent = result;
                                    div.className = 'text-gray-400 pointer-events-none italic';
                                    div.style.userSelect = 'none';

                                    const deco = Decoration.widget(selection.from, div, { side: 1 });
                                    decorationSet = DecorationSet.create(state.doc, [deco]);

                                    // Dispatch changes to update view
                                    view.dispatch(view.state.tr.setMeta('aiAutocomplete', decorationSet));
                                }
                            } catch (e) {
                                console.error(e);
                            } finally {
                                isFetching = false;
                            }
                        }, 1500); // 1.5s pause

                        return false; // let default handler run
                    }
                },
            }),
        ];
    },
});
