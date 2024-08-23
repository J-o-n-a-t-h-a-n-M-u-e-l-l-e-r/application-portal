<script setup lang="ts">
import { navigationMenuTriggerStyle } from "~/components/ui/navigation-menu"
import { useToast } from "~/components/ui/toast/use-toast"
import { ToastAction } from "~/components/ui/toast"

const networkStore = useNetworkStore()
const authStore = useAuthStore()
const appDataStore = useAppDataStore()
const router = useRouter()
const { $pwa } = useNuxtApp()
const { toast } = useToast()

// Request persistent storage permission
if (navigator.storage && navigator.storage.persist) {
    appDataStore.isStoragePersisted = await navigator.storage.persist()
    console.log(`Persisted storage granted: ${appDataStore.isStoragePersisted}`)
} else {
    console.log("Persistent storage not supported")
}

const logout = async () => {
    await authStore.logout()
    await router.push("/login")
}

watch(
    () => $pwa?.needRefresh,
    (value) => {
        if (value) {
            toast({
                duration: 10000,
                title: "New Version is Available",
                description: "A new version of the site is available. Click the refresh button to update.",
                action: h(
                    ToastAction,
                    {
                        altText: "Refresh",
                        onClick: () => {
                            $pwa?.updateServiceWorker()
                        },
                    },
                    {
                        default: () => "Refresh",
                    },
                ),
            })
        }
    },
)
</script>

<template>
    <div>
        <div class="p-4 flex justify-between items-center flex-wrap">
            <NavigationMenu class="w-3/4">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NuxtLink to="/">
                            <NavigationMenuLink :class="navigationMenuTriggerStyle()"> Home</NavigationMenuLink>
                        </NuxtLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem v-if="authStore.isStudent">
                        <NuxtLink to="/apply">
                            <NavigationMenuLink :class="navigationMenuTriggerStyle()"> Apply</NavigationMenuLink>
                        </NuxtLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem v-if="authStore.isStaff">
                        <NuxtLink to="/applications">
                            <NavigationMenuLink :class="navigationMenuTriggerStyle()"> Applications</NavigationMenuLink>
                        </NuxtLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NuxtLink to="/account">
                            <NavigationMenuLink :class="navigationMenuTriggerStyle()"> Account</NavigationMenuLink>
                        </NuxtLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem v-if="!authStore.isAuthenticated">
                        <NuxtLink to="/login">
                            <NavigationMenuLink :class="navigationMenuTriggerStyle()"> Login/Register</NavigationMenuLink>
                        </NuxtLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem v-if="authStore.isAuthenticated">
                        <NavigationMenuLink :class="navigationMenuTriggerStyle()" style="cursor: pointer" @click="logout"> Logout</NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div class="flex items-center">
                <ColorModeToggle />
                <p class="ml-4 !mt-0 text-right" data-testid="network-status">{{ networkStore.isOnline ? "🟢" : "🔴" }}</p>
            </div>
        </div>
        <main>
            <slot />
        </main>
        <footer class="p-4 text-center">
            <p class="text-sm mt-2">Jonathan Müller - 2024 - Application Portal</p>
        </footer>
    </div>
</template>

<style></style>
