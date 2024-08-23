export default defineNuxtRouteMiddleware((to) => {
    const localAuthObject = localStorage.getItem("auth")
    const isAuthenticated = localAuthObject ? JSON.parse(localAuthObject).token : null

    // if token exists and url is /login redirect to homepage
    if (isAuthenticated && to?.name === "login") {
        return navigateTo("/")
    }

    // if token doesn't exist redirect to log in
    if (!isAuthenticated && to?.name !== "login") {
        abortNavigation()
        return navigateTo("/login")
    }
})
