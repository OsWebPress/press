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
import ShowPreview from '@/components/editor/ShowPreview.vue';
import { usePreviewStore } from '@/stores/preview';

const store = useUserStore();
const codemirrorRef = ref(null);
const mirrorView = ref(null)
const filesJson = ref({});
const activePath = ref(undefined)
const context = ref({});
const login = ref(false)
const selectedPath = ref('')
const preview = ref(false)
const liveContent = ref('')
const background = ref("");
const iframeRef = ref(null)

watch(liveContent, (newContent) => {
  localStorage.setItem('previewContent', newContent)
  iframeRef.value?.contentWindow.postMessage({ content: newContent }, '*')
}, { immediate: true })

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

function togglePreview() {
	preview.value = !preview.value
}

// funciton can be optimized by first creating the context in the frontend and then adding the file to the backend.
async function createFile(path) {
	try {
		await myAxios.post(path, "");
		setFilesJson();
		setActiveEditor({path: path, name: path.split("/").pop()})
	} catch (error) {
		console.error("error posting the document", error);
	}
}

async function deleteFile(path) {
	// delete context.value[path] // do we want to get rid of the context right away?
	setFilesJson()
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
		context.value[newDocPath].saved = saved;
		liveContent.value = context.value[newDocPath].content;
    }
}

function setUnsaved() {
	context.value[activePath.value].saved = '🛑';
	liveContent.value = mirrorView.value.state.doc.toString();
}

async function saveFile() {
	try {
		const response = await myAxios.post(activePath.value, mirrorView.value.state.doc.toString());
		context.value[activePath.value].saved = '✔'

	} catch (error) {
		login.value = false
		console.error("error posting the document", error);
		// add prompt to login here.
		// can be achieved with the login widget as overlay.
	}
}

async function setFilesJson() {
	const response = await myAxios.get('ronly/')
	filesJson.value = response.data;
	filesJson.value.children = response.data.children.filter(child => child.name !== "images");
	filesJson.value.children = response.data.children.filter(child => child.name !== ".git");
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
	setFilesJson()

	background.value = await getBackground();

	watch(() => store.user, (newValue) => {
    if (newValue !== "") {
      login.value = false
    } else {
      login.value = true;
    }
  }, { immediate: true });
});

async function getBackground() {
	try {
		const response = await myAxios.get("carbon/background.md");
		return response.data;
	} catch (error) {
		console.error("error fetching background document", error);
		return "";
	}
}
</script>

<template>
<title>Editor</title>
<Login class="absolute top-1/4 left-1/6" v-if="login"/>
<ShowPreview v-if="preview === false" @foldOut="togglePreview" class="z-10"/>

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
		</div>
		<div ref="codemirrorRef" class="top-0 left-0 w-full h-auto overflow-y-auto"></div>
	</div>
	<div v-if="preview" class="w-1/2 border-t-2 border-blue relative bg-blue-100">
		<!-- <Makedown :content="background" class="absolute inset-0 bg-blue-100"/> -->
		<!-- <Makedown :content="liveContent" class="relative pl-24 pr-8 z-10"/> -->
		<!-- <Makedown :content="liveContent" class="relative pl-24 pr-8 max-w-4xl z-10 scale-50 origin-top-left -translate-x-0"/> -->
		<!-- <Makedown :content="liveContent" class="origin-top-left scale-50 w-[200%] h-[200%] pl-24 pr-8"/> -->
		<!-- <Makedown :content="liveContent" class="origin-top-left pl-24 pr-8 scale-75"/> -->
		 <iframe ref="iframeRef" src="/admin/preview" @load="iframeRef.contentWindow.postMessage({ content: liveContent }, '*')" class="w-full h-full border-none"/>
	</div>

</div>
</div>
</template>
