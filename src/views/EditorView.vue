<script setup>
import { ref, onMounted, watch } from 'vue';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { markdown } from '@codemirror/lang-markdown';
import { myAxios } from '@/axios.ts'
import LegendDirectory from '@/components/editor/LegendDirectory.vue'
import LoadNav from '@/components/LoadNav.vue'
import navData from '@/assets/adminNavigation.json'
import { useUserStore } from '@/stores/user';
import Login from '@/components/Login.vue';

const store = useUserStore();
const codemirrorRef = ref(null);
const mirrorView = ref(null)
const filesJson = ref({});
const activePath = ref(undefined)
const context = ref({});
const login = ref(false)
const selectedPath = ref('')

async function setActiveEditor(doc) {
	if (doc.path === activePath.value)
		return;
	if (doc.path in context.value) {
		updateDocument(doc.path)
	}
	try {
		const response = await myAxios.get(doc.path, {
        transformResponse: (res) => {
            // Do your own parsing here if needed ie JSON.parse(res);
            return res;
        },
        responseType: 'text'
    	});
		const page = {name: doc.name, content: response.data};
		context.value[doc.path] = page;
		updateDocument(doc.path);
		context.value[activePath.value].saved = '✔';

	} catch (error) {
		console.error("error fetching document", error);
	}
}

function setSelectedPath(doc) {
	selectedPath.value = doc.path
}

// funciton can be optimized by first creating the context in the frontend and then adding the file to the backend.
async function createFile(path) {
	try {
		await myAxios.post(path, "");
		const response = await myAxios.get('ronly/files')
		filesJson.value = response.data;
		setActiveEditor({path: path, name: path.split("/").pop()})
	} catch (error) {
		console.error("error posting the document", error);
	}
}

async function deleteFile(path) {
	// delete context.value[path] // do we want to get rid of the context right away?
	const response = await myAxios.get('ronly/files')
	filesJson.value = response.data;
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
		const response = await myAxios.post(activePath.value, mirrorView.value.state.doc.toString());
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
	filesJson.value = response.data;
	filesJson.value.children = response.data.children.filter(child => child.name !== "images");

	watch(() => store.user, (newValue) => {
    if (newValue !== "") {
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
		<LegendDirectory :dir="filesJson" :selected="selectedPath" @openFile="setActiveEditor" @selectedPath="setSelectedPath" @createFile="createFile" @deleteFile="deleteFile" />
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
					class="text-white px-4 border-white border-1 h-full cursor-pointer">
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
