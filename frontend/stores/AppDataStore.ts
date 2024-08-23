import { defineStore } from "pinia"
import type { Ref } from "vue"
import { FetchError } from "ofetch"
import { STUDENTS_ENDPOINT } from "~/server/endpoints"

export const useAppDataStore = defineStore("appdata", () => {
    const students: Ref<Student[]> = ref([])
    const authStore = useAuthStore()
    const isStoragePersisted = ref(false)
    const isNotificationsGranted = ref(false)

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
        students,
        fetchStudents,
        formatDate,
        isStoragePersisted,
        isNotificationsGranted,
    }
})
