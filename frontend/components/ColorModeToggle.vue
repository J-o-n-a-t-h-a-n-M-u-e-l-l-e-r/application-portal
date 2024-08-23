<script setup lang="ts">
import MoonIcon from "~/components/icons/Moon-Icon.vue"
import SunIcon from "~/components/icons/Sun-Icon.vue"
import { useColorThemeStore } from "~/stores/ColorThemeStore"

const colorThemeStore = useColorThemeStore()

onMounted(() => {
    colorThemeStore.setTheme()
})
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="outline">
                <MoonIcon class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <SunIcon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span class="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem @click="colorThemeStore.toggleTheme('light')"> Light</DropdownMenuItem>
            <DropdownMenuItem @click="colorThemeStore.toggleTheme('dark')"> Dark</DropdownMenuItem>
            <DropdownMenuItem @click="colorThemeStore.toggleTheme('system')"> System</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<style scoped></style>
