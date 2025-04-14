<script setup>
import { ref, onMounted, watch } from 'vue';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { markdown } from '@codemirror/lang-markdown';
import { myAxios } from '@/axios.ts'
import LegendDirectory from '@/components/LegendDirectory.vue'
import LoadNav from '@/components/LoadNav.vue'
import navData from '@/assets/adminNavigation.json'
import { useTokenStore } from '@/stores/token';
import Login from '@/components/Login.vue';

const tokenstore = useTokenStore();
const codemirrorRef = ref(null);
const mirrorView = ref(null)
const files_json = ref([]);
const activePath = ref(undefined)
const context = ref({});
const login = ref(false)

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
		context.value[activePath.value].saved = '✔';

	} catch (error) {
		console.error("error fetching document", error);
	}
}

function updateDocument(newDocPath) {
    if (mirrorView.value) {
		const saved = context.value[newDocPath].saved;
		// set old context
		if (activePath.value !== undefined) {
			context.value[activePath.value].content = mirrorView.value.state.doc.toString();
		}

		activePath.value = newDocPath;
		mirrorView.value.dispatch({
            changes: { from: 0, to: mirrorView.value.state.doc.length, insert: context.value[newDocPath].content },
        });
		context.value[newDocPath].saved = saved
    }
}

function setUnsaved() {
	context.value[activePath.value].saved = '🛑';
}

async function saveFile() {
	try {
		const response = await myAxios.post(activePath.value.replace(/\.md$/, ''), mirrorView.value.state.doc.toString());
		context.value[activePath.value].saved = '✔'

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

	watch(() => tokenstore.token, (newValue) => {
    if (newValue !== '') {
      login.value = false
    //   const decodedToken = jwtDecode(newValue);
    //   role.value = decodedToken.role || null;
    } else {
      login.value = true;
    }
  }, { immediate: true });
});
</script>

<template>
<Login class="absolute top-1/4 left-1/6" v-if="login"/>

<div class="h-screen flex flex-col">
	<div class="w-full z-50">
		<LoadNav :navData />
	</div>
<div class="border-green-500 border-2 flex flex-grow bg-black">
	<div class="w-1/4 border-blue-500 border-2 ">
		<LegendDirectory :dir="files_json" @openFile="setActiveEditor" />
	</div>
	<div class="w-3/4 border-red-500 border-2 flex-grow">
		<div class="h-8 border-white border-1 flex-grow flex">
			<div class="flex-none" v-for="(item, identifier) in context">
				<button v-if="identifier === activePath"
					@click="saveFile"
					class="text-white px-4 border-teal-600 border-4 h-full cursor-pointer">
					{{item.name}} {{item.saved}}
				</button>
				<button v-else
					@click="updateDocument(identifier)"
					class="text-white px-4 barder-white border-1 h-full cursor-pointer">
					{{item.name}} {{item.saved}}
				</button>

			</div>
			<!-- add the tabs here -->
		</div>
		<div ref="codemirrorRef" class="top-0 left-0 w-full h-auto overflow-y-auto"></div>
	</div>

</div>
</div>
</template>
