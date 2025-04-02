<script setup>
import { ref, onMounted } from 'vue';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { EditorState, StateField } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { markdown } from '@codemirror/lang-markdown';

import instance  from '@/main.ts'

const file = ref('')
const codemirrorRef = ref(null);
const mirrorView = ref(null)
const saved = ref('');

async function getDocument()  {
	try {
		const response = await instance.get("carbon/" + file.value);

		updateDocument(response.data);

	} catch (error) {
		console.error("error fetching document", error);
	}
}

async function postDocument() {
	try {
		const response = await instance.post("carbon/" + file.value, mirrorView.value.state.doc.toString());
		saved.value = '';

	} catch (error) {
		console.error("error posting the document", error);
		// add prompt to login here.
		// can be achieved with the login widget as overlay.
	}
}

function updateDocument(newDoc) {
    if (mirrorView.value) {
		mirrorView.value.dispatch({
            changes: { from: 0, to: mirrorView.value.state.doc.length, insert: newDoc },
        });
    }
}

function setUnsaved() {
	saved.value = '•';
}

onMounted(() => {
    if (codemirrorRef.value) {
        let startState = EditorState.create({
            doc: 'Select a file before editing!',
            extensions: [
                oneDark,
                lineNumbers(),
                keymap.of([...defaultKeymap, ...historyKeymap]),
                history(),
				markdown(),
				EditorView.updateListener.of(function(e) {
                if (e.docChanged) {
                    setUnsaved();
                }
            }),
            ],
        });

        mirrorView.value = new EditorView({
            state: startState,
            parent: codemirrorRef.value,
			extensions: [
				markdown(),
				EditorView.updateListener.of(function(e) {
                if (e.docChanged) {
                    setUnsaved();
                }
            }),
			],
        });
    }
});
</script>

<template>
<div class="absolute top-1/16 left-0 border-green-500 border-2 w-full h-15/16 flex">
	<div class="w-1/4 border-blue-500 border-2 h-full"></div>
	<div class="w-3/4 border-red-500 border-2 flex-grow">
		<div class="h-10">
			<input v-model="file" placeholder="file:" class="rounded-sm bg-orange-200 text-black" />
			<button @click="getDocument" class="px-2 rounded-lg bg-teal-600 text-white">get</button>
			<button @click="postDocument" class="px-2 rounded-lg bg-amber-600 text-white">Post {{ saved }} </button>
		</div>
		<div ref="codemirrorRef" class="top-0 left-0 w-full h-full overflow-y-auto"></div>
	</div>

</div>
</template>