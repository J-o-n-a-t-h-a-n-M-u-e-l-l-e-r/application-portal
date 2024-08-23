import { defineStore } from "pinia"
import { PAGE_SIZE } from "assets/constants"
import { FetchError } from "ofetch"
import { APPLICATION_COMMENTS_ENDPOINT, APPLICATIONS_ENDPOINT, STUDENT_APPLICATIONS_ENDPOINT } from "~/server/endpoints"

export const useApplicationsStore = defineStore("applications", () => {
    const authStore = useAuthStore()
    const applications = ref<ApplicationMap>({})
    const applicationPageMap = ref<ApplicationsPageMap>({})
    const count = ref(0)
    const previous = ref<string | null>(null)
    const next = ref<string | null>(null)
    const pending = ref(false)

    const applicationById = computed(() => (id: number) => applications.value[id])

    async function getApplications(page: number) {
        pending.value = true
        try {
            const res = await $fetch<ApplicationList>(`${APPLICATIONS_ENDPOINT}?page=${page}`, {
                headers: {
                    Authorization: `Token ${authStore.token}`,
                },
            })
            res.results.forEach((a) => (applications.value[a.id] = a))
            count.value = res.count
            previous.value = res.previous
            next.value = res.next
            applicationPageMap.value[page] = res.results.map((a) => a.id)
        } catch (e) {
            handleErrors(e)
        } finally {
            pending.value = false
        }
    }

    async function getAllApplications() {
        await getApplications(1)
        for (let i = 2; i <= Math.ceil(count.value / PAGE_SIZE); i++) {
            await getApplications(i)
        }
    }

    async function getApplication(id: number) {
        pending.value = true
        try {
            applications.value[id] = await $fetch<Application>(`${APPLICATIONS_ENDPOINT}${id}/`, {
                headers: {
                    Authorization: `Token ${authStore.token}`,
                },
            })
        } catch (e) {
            handleErrors(e)
        } finally {
            pending.value = false
        }
    }

    function getApplicationsByPage(page: number) {
        const pageIds = applicationPageMap.value[page]
        const res: Application[] = []
        if (!pageIds) return res
        pageIds.forEach((id) => {
            if (applications.value[id]) res.push(applications.value[id])
        })
        return res
    }

    async function createApplication(formData: FormData): Promise<void> {
        await $fetch<Application>(`${STUDENT_APPLICATIONS_ENDPOINT(authStore.user!.id)}`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Token ${authStore.token}`,
            },
        })
    }

    async function updateApplication(application: Application) {
        try {
            application = {
                ...application,
                updated_at: new Date().toISOString(),
            }
            await $fetch(`${APPLICATIONS_ENDPOINT}${application.id}/`, {
                method: "PUT",
                body: JSON.stringify(application),
                headers: {
                    Authorization: `Token ${authStore.token}`,
                },
            })
            await getApplication(application.id)
        } catch (e) {
            handleErrors(e)
        }
    }

    async function createComment(application: number, comment: ApplicationComment) {
        try {
            applications.value[application].comments.push(comment)
            applications.value[application].comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            await $fetch<ApplicationComment>(APPLICATION_COMMENTS_ENDPOINT(application), {
                method: "POST",
                body: JSON.stringify({ text: comment.text, created_by: comment.created_by.user_id, created_at: comment.created_at, updated_at: comment.updated_at }),
                headers: {
                    Authorization: `Token ${authStore.token}`,
                },
            })
            await getApplication(application)
        } catch (e) {
            handleErrors(e)
        }
    }

    function handleErrors(e: unknown) {
        if (e instanceof FetchError && e.response && e.response.status === 401) {
            authStore.logout().catch(console.error)
        } else {
            console.error(e)
        }
    }

    const saveCurrentPage = (page: number) => {
        localStorage.setItem("currentPage", page.toString())
    }

    const loadCurrentPage = () => {
        const savedPage = localStorage.getItem("currentPage")
        return savedPage ? parseInt(savedPage, 10) : 1 // Default to 1 if not found
    }

    return {
        applications,
        applicationPageMap,
        getApplicationsByPage,
        getAllApplications,
        count,
        previous,
        next,
        getApplications,
        getApplication,
        applicationById,
        createComment,
        updateApplication,
        createApplication,
        pending,
        saveCurrentPage,
        loadCurrentPage,
    }
})
