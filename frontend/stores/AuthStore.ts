import type { Ref } from "vue"
import { FetchError } from "ofetch"
import { LOGIN_ENDPOINT, LOGOUT_ALL_ENDPOINT, LOGOUT_ENDPOINT, PROFILE_ENDPOINT, REGISTER_ENDPOINT } from "~/server/endpoints"
import { prefetch } from "~/server/prefetching"

export const useAuthStore = defineStore(
    "auth",
    () => {
        const user = ref<User | null>(null)
        const token: Ref<string | null> = ref(null)
        const expires: Ref<string | null> = ref(null)
        const isAuthenticated = computed(() => !!token.value)
        const isStudent = computed(() => !!user.value?.student_profile)
        const isStaff = computed(() => !!user.value?.staff_profile)

        // do not use directly, use getLocalID() instead only exposed for storing in localStorage
        const nextTempId = ref(Number.MIN_SAFE_INTEGER)

        // returns a unique id for the client
        function getLocalID() {
            nextTempId.value++
            return nextTempId.value
        }

        const register = async (userObject: RegisterUser, password: string) => {
            const obj: RegisterUser = userObject
            if (userObject.staff) {
                delete obj.staff!.user_id
            }
            if (userObject.student) {
                delete obj.student!.user_id
            }
            await $fetch<{ username: string }>(REGISTER_ENDPOINT, {
                method: "POST",
                body: JSON.stringify({ password, ...obj }),
            })
        }

        const prefetchData = async (token: string) => {
            await prefetch(token)
            location.reload()
        }

        const login = async (username: string, password: string) => {
            const data = await $fetch<{ expiry: string; token: string }>(LOGIN_ENDPOINT, {
                method: "POST",
                body: JSON.stringify({ username, password }),
            })
            token.value = data!.token
            expires.value = data!.expiry
            await profile()
            if (isStaff.value) {
                prefetchData(data!.token)
            }
        }

        const logout = async () => {
            try {
                await $fetch(LOGOUT_ENDPOINT, {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token.value}`,
                    },
                })
            } catch (e) {
                console.error(e)
            } finally {
                user.value = null
                token.value = null
                expires.value = null
            }
        }

        const logoutAll = async () => {
            try {
                await $fetch(LOGOUT_ALL_ENDPOINT, {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${token.value}`,
                    },
                })
            } catch (e) {
                console.error(e)
            } finally {
                user.value = null
                token.value = null
                expires.value = null
            }
        }

        const profile = async () => {
            try {
                user.value = await $fetch<User>(PROFILE_ENDPOINT, {
                    headers: {
                        Authorization: `Token ${token.value}`,
                    },
                })
            } catch (e: unknown) {
                if (e instanceof FetchError && e.response && e.response.status === 401) {
                    await logout()
                } else {
                    console.error(e)
                }
            }
        }

        return {
            nextTempId,
            getLocalID,
            user,
            token,
            expires,
            isAuthenticated,
            register,
            login,
            logout,
            logoutAll,
            profile,
            isStudent,
            isStaff,
        }
    },
    {
        persist: {
            // paths: ['token', 'expires', 'isAuthenticated'],
            storage: localStorage,
        },
    },
)
