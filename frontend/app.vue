<script setup lang="ts">
import { useNetworkStore } from "~/stores/NetworkStore"
import { Toaster } from "~/components/ui/toast"
import { useWebWorkerManager } from "~/composables/useWebWorkerManager"

const networkStore = useNetworkStore()
const { terminateAllWorkers } = useWebWorkerManager()

onMounted(() => {
    window.addEventListener("online", networkStore.updateOnlineStatus)
    window.addEventListener("offline", networkStore.updateOnlineStatus)
    networkStore.startAutoUpdate()
})

onUnmounted(() => {
    window.removeEventListener("online", networkStore.updateOnlineStatus)
    window.removeEventListener("offline", networkStore.updateOnlineStatus)
    networkStore.stopAutoUpdate()
    terminateAllWorkers()
})
</script>

<template>
    <Toaster />
    <div>
        <VitePwaManifest />
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
