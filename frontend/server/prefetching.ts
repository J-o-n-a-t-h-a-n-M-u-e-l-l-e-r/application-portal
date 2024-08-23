import { PREFETCH_ENDPOINT } from "~/server/endpoints"
import { useAppDataStore } from "~/stores/AppDataStore"
import { useNetworkStore } from "~/stores/NetworkStore"

async function fetchUrlsToPreCache(token: string, all: boolean = false) {
    try {
        const endpoint = all ? PREFETCH_ENDPOINT + "?all=true" : PREFETCH_ENDPOINT
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                Authorization: `Token ${token}`,
            },
        })
        return await response.json()
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function prefetch(token: string) {
    try {
        const appDataStore = useAppDataStore()
        const networkStore = useNetworkStore()
        // Prefetch only if network score is greater than 2
        if (networkStore.getNetworkScore() > 2) {
            let urls: string[]
            if (networkStore.getNetworkScore() > 3) {
                // Prefetch all applications/documents
                await appDataStore.init(true)
                urls = await fetchUrlsToPreCache(token, true)
            } else {
                // Prefetch only first page of applications/documents
                await appDataStore.init(false)
                urls = await fetchUrlsToPreCache(token, false)
            }
            const cache = await caches.open("documents-cache")
            await cache.addAll(urls)
        }
    } catch {
        console.error("Failed to fetch urls to cache")
    }
}
