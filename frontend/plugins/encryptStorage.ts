import { EncryptStorage } from "encrypt-storage"
import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig()

    // Ensure EncryptStorage is only initialized on the client side
    const encryptStorage: EncryptStorage | null = typeof window !== "undefined" ? new EncryptStorage(runtimeConfig.public.encryptionKey, { stateManagementUse: true }) : null

    nuxtApp.provide("encryptStorage", encryptStorage)
})
