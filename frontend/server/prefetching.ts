import { PREFETCH_ENDPOINT } from "~/server/endpoints"
import { useAppDataStore } from "~/stores/AppDataStore"

async function fetchUrlsToPreCache(token: string) {
    try {
        const response = await fetch(PREFETCH_ENDPOINT, {
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
        // Fetch applications
        const appDataStore = useAppDataStore()
        await appDataStore.init()
        // Fetch documents of applications
        const urls = await fetchUrlsToPreCache(token)
        const cache = await caches.open("documents-cache")
        await cache.addAll(urls)
    } catch {
        console.error("Failed to fetch urls to cache")
    }
}
