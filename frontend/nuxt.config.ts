// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    ssr: false,
    runtimeConfig: {
        public: {
            encryptionKey: process.env.NUXT_ENCRYPTION_KEY,
            api_url: process.env.NUXT_API_URL,
            app_url: process.env.NUXT_APP_URL,
        },
    },
    plugins: ["~/plugins/encryptStorage"],
    modules: ["@pinia/nuxt", "@pinia-plugin-persistedstate/nuxt", "@vite-pwa/nuxt", "@nuxtjs/tailwindcss", "@nuxtjs/color-mode", "shadcn-nuxt", "@nuxt/eslint"],
    devtools: { enabled: true },
    piniaPersistedstate: {
        storage: "localStorage",
    },
    app: {
        head: {
            title: "Application Portal",
            meta: [
                { charset: "utf-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" },
                { name: "description", content: "Application Portal for students" },
                { name: "theme-color", content: "#ffffff" },
                { name: "robots", content: "noindex, nofollow" },
            ],
            link: [
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
                { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon_32x32.png" },
                { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon_48x48.png" },
                { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon_96x96.png" },
                { rel: "icon", type: "image/png", sizes: "192x192", href: "/favicon_192x192.png" },
            ],
        },
    },
    pwa: {
        registerType: "prompt",
        strategies: "injectManifest",
        injectManifest: {
            globPatterns: ["**/*.{js,css,html,png,jpg,svg,json,vue,ico,txt,woff2}"],
        },
        includeAssets: ["favicon.ico", "img/icon-192x192.png", "img/icon-512x512.png"],
        /* Activate for periodic update checks
        client: {
            periodicSyncForUpdates: 120, // 120 seconds
        },
        */
        devOptions: {
            enabled: true,
            type: "module",
        },
        manifest: {
            name: "Application Portal",
            short_name: "AP",
            description: "Application Portal for Students",
            theme_color: "#ffffff",
            lang: "en",
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            icons: [
                {
                    src: "/img/icon-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                },
                {
                    src: "/img/icon-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any",
                },
                {
                    src: "/img/icon-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "maskable",
                },
            ],
            screenshots: [
                {
                    src: "/img/apply-screenshot-narrow.png",
                    sizes: "449x621",
                    type: "image/png",
                    form_factor: "narrow",
                    label: "Apply Page",
                },
                {
                    src: "/img/apply-screenshot-wide.png",
                    sizes: "1215x648",
                    type: "image/png",
                    form_factor: "wide",
                    label: "Apply Page",
                },
            ],
        },
    },
    shadcn: {
        prefix: "",
        componentDir: "./components/ui",
    },
    colorMode: {
        classSuffix: "",
    },
    eslint: {
        config: {
            stylistic: true,
        },
    },
})
