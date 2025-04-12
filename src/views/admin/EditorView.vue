<script setup>
import { ref, onMounted } from 'vue';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { markdown } from '@codemirror/lang-markdown';
import { myAxios } from '@/axios.ts'
import LegendDirectory from '@/components/LegendDirectory.vue'

const file = ref('')
const codemirrorRef = ref(null);
const mirrorView = ref(null)
const saved = ref('');
const files_json = ref([]);
const activePath = ref(undefined)
const context = ref({});
// context: {<path>: {name, content}}

async function setActiveEditor(doc) {
	if (doc.path === activePath.value)
		return;
	if (doc.path in context.value) {
		updateDocument(doc.path)
	}
	try {
		const response = await myAxios.get(doc.path.replace(/\.md$/, ''));
		const page = {name: doc.name, content: response.data};
		context.value[doc.path] = page;
		updateDocument(doc.path);

	} catch (error) {
		console.error("error fetching document", error);
	}
}

function updateDocument(newDocPath) {
    if (mirrorView.value) {
		// set old context
		if (activePath.value !== undefined) {
			context.value[activePath.value].content = mirrorView.value.state.doc.toString();
		}

		activePath.value = newDocPath;
		mirrorView.value.dispatch({
            changes: { from: 0, to: mirrorView.value.state.doc.length, insert: context.value[newDocPath].content },
        });
		context.value[activePath.value].saved = " ";
    }
}

function setUnsaved() {
	context.value[activePath.value].saved = '•';
}

async function saveFile() {
	try {
		const response = await myAxios.post(activePath.value.replace(/\.md$/, ''), mirrorView.value.state.doc.toString());
		saved.value = '   ';

	} catch (error) {
		console.error("error posting the document", error);
		// add prompt to login here.
		// can be achieved with the login widget as overlay.
	}
}

onMounted(async () => {
    if (codemirrorRef.value) {
        let startState = EditorState.create({
            doc: 'Select a file before editing!',
            extensions: [
                oneDark,
                lineNumbers(),
                keymap.of([...defaultKeymap, ...historyKeymap,
				{
                key: 'Mod-s',
                preventDefault: true,
                run: saveFile,
              },
				]),
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
	const response = await myAxios.get('ronly/files')
	files_json.value = response.data;
});
</script>

<template class="bg-black">
<div class="absolute top-1/16 left-0 border-green-500 border-2 w-full h-15/16 flex bg-black">
	<div class="w-1/4 border-blue-500 border-2 h-full">
		<LegendDirectory :dir="files_json" @openFile="setActiveEditor" />
	</div>
	<div class="w-3/4 border-red-500 border-2 flex-grow">
		<div class="h-8 border-white border-1 flex-grow flex">
			<div class="flex-none" v-for="(item, identifier) in context">
				<button v-if="identifier === activePath"
					class="text-white px-4 border-teal-600 border-4 h-full">
					{{item.name}} {{item.saved}}
				</button>
				<button v-else
					@click="updateDocument(identifier)"
					class="text-white px-4 barder-white border-1 h-full">
					{{item.name}} {{item.saved}}
				</button>

			</div>
			<!-- add the tabs here -->
		</div>
		<div ref="codemirrorRef" class="top-0 left-0 w-full h-full overflow-y-auto"></div>
	</div>

</div>
</template>
