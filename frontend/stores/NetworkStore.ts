import { defineStore } from "pinia"

export const useNetworkStore = defineStore("network", () => {
    const isOnline = ref(navigator.onLine)
    const networkType = ref("")
    const bandwidth = ref(0)
    const rtt = ref(0)
    const isSavingData = ref(false)
    let networkIntervalID: NodeJS.Timeout | null = null

    function updateOnlineStatus() {
        isOnline.value = navigator.onLine
        // Trigger Background Sync queue if online
        if (isOnline.value) {
            if ("serviceWorker" in navigator && "SyncManager" in window) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.sync
                        .register("syncData")
                        .then(() => {
                            console.log("Sync registered")
                        })
                        .catch((e) => {
                            console.log("Sync registration failed", e)
                        })
                })
            }
        }
    }

    function updateNetworkInfo() {
        if (navigator.connection) {
            networkType.value = navigator.connection.effectiveType
            bandwidth.value = navigator.connection.downlink
            rtt.value = navigator.connection.rtt
            isSavingData.value = navigator.connection.saveData
        }
    }

    function startAutoUpdate() {
        updateNetworkInfo()
        if (navigator.connection) {
            networkIntervalID = setInterval(() => {
                updateNetworkInfo()
            }, 1000)
        }
    }

    function stopAutoUpdate() {
        if (navigator.connection && networkIntervalID) {
            clearInterval(networkIntervalID)
            networkIntervalID = null
        }
    }

    return {
        isOnline,
        updateOnlineStatus,
        networkType,
        bandwidth,
        rtt,
        isSavingData,
        startAutoUpdate,
        stopAutoUpdate,
    }
})
