import { defineStore } from "pinia"
import type { Ref } from "vue"
import { FetchError } from "ofetch"
import { STUDENTS_ENDPOINT } from "~/server/endpoints"
// import type { StorageLike } from "pinia-plugin-persistedstate"

export const useAppDataStore = defineStore(
    "appdata",
    () => {
        const students: Ref<Student[]> = ref([])
        const applications = useApplicationsStore()
        const authStore = useAuthStore()
        const isStoragePersisted = ref(false)
        const isNotificationsGranted = ref(false)

        async function init() {
            await applications.getApplications()
            await fetchStudents()
        }

        async function fetchStudents() {
            try {
                const data = await $fetch<Student[]>(STUDENTS_ENDPOINT, {
                    headers: {
                        Authorization: `Token ${authStore.token}`,
                    },
                })
                if (data) {
                    students.value = data
                }
            } catch (e: unknown) {
                if (e instanceof FetchError && e.response && e.response.status === 401) {
                    await authStore.logout()
                } else {
                    console.error(e)
                }
            }
        }

        function formatDate(date: string) {
            const d = new Date(date)
            const day = d.getDate().toString().padStart(2, "0")
            const month = (d.getMonth() + 1).toString().padStart(2, "0") // +1 because getMonth() returns month from 0 to 11
            const year = d.getFullYear()
            const hours = d.getHours().toString().padStart(2, "0")
            const minutes = d.getMinutes().toString().padStart(2, "0")
            return `${day}.${month}.${year} ${hours}:${minutes}`
        }

        return {
            applications,
            students,
            fetchStudents,
            init,
            formatDate,
            isStoragePersisted,
            isNotificationsGranted,
        }
    },
    {
        persist: {
            paths: ["students", "isStoragePersisted", "isNotificationsGranted"],
            // For encrypting localStorage uncomment the following and the import statement above
            /*storage: {
                getItem(key: string) {
                    const nuxtApp = useNuxtApp()
                    const es = nuxtApp.$encryptStorage as StorageLike
                    return es.getItem(key)
                },
                setItem(key: string, value: string) {
                    const nuxtApp = useNuxtApp()
                    const es = nuxtApp.$encryptStorage as StorageLike
                    es.setItem(key, value)
                },
            },*/
        },
    },
)
