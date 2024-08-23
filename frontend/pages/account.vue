<script setup lang="ts">
const authStore = useAuthStore()
const appDataStore = useAppDataStore()
const networkStore = useNetworkStore()
const router = useRouter()
const connection = navigator.connection

const logoutAll = async () => {
    await authStore.logoutAll()
    await router.push("/login")
}

// Check if site's storage has been marked as persistent
const refreshPersisted = async () => {
    if (navigator.storage && navigator.storage.persisted) {
        appDataStore.isStoragePersisted = await navigator.storage.persisted()
        console.log(`Persisted storage granted: ${appDataStore.isStoragePersisted}`)
    }
}

// Request notification permission as some browsers require notification permission to grant persistent storage
const requestNotificationPermission = async () => {
    Notification.requestPermission().then((result) => {
        appDataStore.isNotificationsGranted = result === "granted"
    })
}
</script>

<template>
    <div>
        <div>
            <h1>Account</h1>
        </div>
        <Button class="mb-2" variant="destructive" @click="logoutAll">Logout from all devices</Button>
        <h2>Notification Information</h2>
        <div>
            <p class="inline-block mr-2">Notifications granted:</p>
            <Badge v-if="appDataStore.isNotificationsGranted">Yes</Badge>
            <Badge v-else variant="destructive">No</Badge>
        </div>
        <Button class="mt-2" size="sm" variant="outline" @click="requestNotificationPermission">Request</Button>
        <h2>Storage Information</h2>
        <div>
            <p class="inline-block mr-2">Storage persisted:</p>
            <Badge v-if="appDataStore.isStoragePersisted">Yes</Badge>
            <Badge v-else variant="destructive">No</Badge>
        </div>
        <Button class="mt-2" size="sm" variant="outline" @click="refreshPersisted">Refresh</Button>
        <div v-if="connection">
            <h2>Network Information</h2>
            <div>
                <p class="inline-block mr-2">Network type:</p>
                <Badge v-if="networkStore.isOnline">{{ networkStore.networkType }}</Badge>
                <Badge v-else variant="destructive">Offline</Badge>
            </div>
            <div>
                <p class="inline-block mr-2">Bandwidth estimate:</p>
                <Badge>{{ networkStore.bandwidth }} Mbps</Badge>
            </div>
            <div>
                <p class="inline-block mr-2">Round-trip time estimate:</p>
                <Badge>{{ networkStore.rtt }} ms</Badge>
            </div>
            <div>
                <p class="inline-block mr-2">Save data mode:</p>
                <Badge v-if="networkStore.isSavingData" variant="destructive">On</Badge>
                <Badge v-else>Off</Badge>
            </div>
            <div>
                <p class="inline-block mr-2">Network Score:</p>
                <Badge>{{ networkStore.getNetworkScore() }}</Badge>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
