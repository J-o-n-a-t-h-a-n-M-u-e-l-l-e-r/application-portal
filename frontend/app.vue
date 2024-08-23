<script setup lang="ts">
import { useNetworkStore } from "~/stores/NetworkStore"
import { Toaster } from "~/components/ui/toast"

const networkStore = useNetworkStore()

onMounted(() => {
    window.addEventListener("online", networkStore.updateOnlineStatus)
    window.addEventListener("offline", networkStore.updateOnlineStatus)
    networkStore.startAutoUpdate()
})

onUnmounted(() => {
    window.removeEventListener("online", networkStore.updateOnlineStatus)
    window.removeEventListener("offline", networkStore.updateOnlineStatus)
    networkStore.stopAutoUpdate()
})
</script>

<template>
    <Toaster />
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
