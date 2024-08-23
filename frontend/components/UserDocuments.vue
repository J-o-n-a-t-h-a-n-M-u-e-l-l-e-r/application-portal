<script setup lang="ts">
import type { Ref } from "vue"
import Loading from "vue-loading-overlay"
import { useNetworkStore } from "~/stores/NetworkStore"
import { useColorThemeStore } from "~/stores/ColorThemeStore"
import { useWebWorkerManager } from "~/composables/useWebWorkerManager"
import { useToast } from "~/components/ui/toast"
import ExclamationTriangle from "~/components/icons/Exclamation-Triangle.vue"

const props = defineProps<{ files: Document[] }>()
const fileURLs: Ref<{ url: string; type: string }[]> = ref([])
const fetchError = ref(false)
const isLoading = ref(false)
const runtimeConfig = useRuntimeConfig()
const networkStore = useNetworkStore()
const colorThemeStore = useColorThemeStore()
const useWebWorker = useWebWorkerManager()
const { toast } = useToast()
const worker = useWebWorker.createWorker()

worker.onmessage = (e) => {
    console.log("Documents data", e)
    if (e.data.error) {
        toast({
            title: "Error",
            description: "An error occurred while fetching documents.",
            variant: "destructive",
        })
        fetchError.value = true
        isLoading.value = false
    } else {
        toast({
            title: "Documents Fetched",
            description: "Documents fetched successfully.",
        })
        useWebWorker.terminateWorker(worker)
        loadFromCache()
    }
}

const fetchDocument = async (i: number) => {
    try {
        const response = await fetch(runtimeConfig.public.api_url + props.files[i].file)
        const blob = await response.blob()
        const objectURL = URL.createObjectURL(blob)
        fileURLs.value.push({ url: objectURL, type: blob.type })
    } catch (error) {
        console.error(error)
        fetchError.value = true
    }
}

const loadFromCache = async () => {
    fetchError.value = false
    caches.open("documents-cache").then((cache) => {
        props.files.forEach((file: { file: string; type: string }) => {
            cache.match(runtimeConfig.public.api_url + file.file).then(async (response) => {
                if (response) {
                    const blob = await response.blob()
                    const objectURL = URL.createObjectURL(blob)
                    fileURLs.value.push({ url: objectURL, type: blob.type })
                } else {
                    fetchError.value = true
                }
            })
        })
    })
    isLoading.value = false
}

onMounted(() => {
    // NOTE we replace the following conditional with fetchDocuments() for the experiments
    if (networkStore.getNetworkScore() < 3) {
        loadFromCache()
    } else {
        fetchDocuments()
    }
})

function fetchDocumentsInBackground() {
    isLoading.value = true
    const serializableFiles = props.files.map((file: { file: string; type: string }) => {
        return {
            file: file.file,
            type: file.type,
        }
    })

    worker.postMessage({
        apiUrl: runtimeConfig.public.api_url,
        files: serializableFiles,
    })
}

const fetchDocuments = async () => {
    fetchError.value = false
    if (props.files.length > 0) {
        isLoading.value = true
        for (let i = 0; i < props.files.length; i++) {
            await fetchDocument(i)
        }
        isLoading.value = false
    }
}
</script>

<template>
    <div v-if="props.files.length > 0">
        <h2>Documents</h2>
        <loading v-if="isLoading" v-model:active="isLoading" :is-full-page="false" :color="colorThemeStore.theme === 'dark' ? '#fff' : '#000'" />
        <Alert v-if="fetchError && !isLoading" variant="destructive" class="max-w-2xl">
            <ExclamationTriangle class="h-4 w-4 mr-2" />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>
                The desired documents are not available at the moment. Click the button below to try again.<br />
                <Button v-if="networkStore.isOnline" size="sm" class="mt-2" variant="outline" @click="fetchDocumentsInBackground">Load</Button>
            </AlertDescription>
            <AlertDescription v-if="!networkStore.isOnline">Check your internet connection and try again.</AlertDescription>
        </Alert>
        <div v-for="file in fileURLs" :key="file.url">
            <embed :src="file.url" :type="file.type" width="100%" height="600px" />
        </div>
    </div>
</template>

<style scoped></style>
