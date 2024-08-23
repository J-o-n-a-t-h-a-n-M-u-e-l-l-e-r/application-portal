<script setup lang="ts">
import type { Ref } from "vue"
import Loading from "vue-loading-overlay"
import { useColorThemeStore } from "~/stores/ColorThemeStore"

const props = defineProps<{ files: Document[] }>()
const fileURLs: Ref<{ url: string; type: string }[]> = ref([])
const fetchError = ref(false)
const isLoading = ref(false)
const runtimeConfig = useRuntimeConfig()
const colorThemeStore = useColorThemeStore()
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

if (props.files.length > 0) {
    isLoading.value = true
    for (let i = 0; i < props.files.length; i++) {
        await fetchDocument(i)
    }
    isLoading.value = false
}
</script>

<template>
    <div v-if="props.files.length > 0">
        <h2>Documents</h2>
        <loading v-if="isLoading" v-model:active="isLoading" :is-full-page="false" :color="colorThemeStore.theme === 'dark' ? '#fff' : '#000'" />
        <p v-if="fetchError">An error occurred while fetching the documents</p>
        <div v-for="file in fileURLs" :key="file.url">
            <embed :src="file.url" :type="file.type" width="100%" height="600px" />
        </div>
    </div>
</template>

<style scoped></style>
