export const useColorThemeStore = defineStore("colorTheme", () => {
    const colorMode = useColorMode()
    const theme = ref<string>("light")

    const toggleTheme = (preference: string) => {
        colorMode.preference = preference
        if (preference === "system") {
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                preference = "dark"
            } else {
                preference = "light"
            }
        }
        theme.value = preference
        // Change theme-color meta tag
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        if (metaThemeColor) {
            metaThemeColor.setAttribute("content", preference === "dark" ? "#000000" : "#ffffff")
        } else {
            const meta = document.createElement("meta")
            meta.name = "theme-color"
            meta.content = preference === "dark" ? "#000000" : "#ffffff"
            document.head.appendChild(meta)
        }
    }

    const setTheme = () => {
        const preference = localStorage.getItem("nuxt-color-mode") || "system"
        toggleTheme(preference)
    }

    return {
        theme,
        toggleTheme,
        setTheme,
    }
})
