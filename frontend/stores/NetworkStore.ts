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
    }

    function updateNetworkInfo() {
        if (navigator.connection) {
            networkType.value = navigator.connection.effectiveType
            bandwidth.value = navigator.connection.downlink
            rtt.value = navigator.connection.rtt
            isSavingData.value = navigator.connection.saveData
        }
    }

    // Score from 0 to 4 based on network quality
    function getNetworkScore() {
        if (navigator.connection) {
            if (!isOnline.value) {
                return 0
            }
            if (networkType.value === "slow-2g") {
                return 1
            }
            if (networkType.value === "2g" || isSavingData.value) {
                return 2
            }
            if (networkType.value === "3g") {
                return 3
            }
            if (networkType.value === "4g") {
                return 4
            }
        }
        return 4
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
        getNetworkScore,
        startAutoUpdate,
        stopAutoUpdate,
    }
})
