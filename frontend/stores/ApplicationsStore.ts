import { defineStore } from "pinia"
import { FetchError } from "ofetch"
import { APPLICATION_COMMENTS_ENDPOINT, APPLICATIONS_ENDPOINT, STUDENT_APPLICATIONS_ENDPOINT } from "~/server/endpoints"
// import type { StorageLike } from "pinia-plugin-persistedstate"

export const useApplicationsStore = defineStore(
    "applications",
    () => {
        const authStore = useAuthStore()
        const applications = ref<Application[]>([])
        const pending = ref(false)

        const applicationById = computed(() => (id: number) => applications.value.find((a) => a.id === id))

        async function getApplications() {
            pending.value = true
            try {
                applications.value = await $fetch<Application[]>(APPLICATIONS_ENDPOINT, {
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

        async function getApplication(id: number) {
            pending.value = true
            try {
                const application = await $fetch<Application>(`${APPLICATIONS_ENDPOINT}${id}/`, {
                    headers: {
                        Authorization: `Token ${authStore.token}`,
                    },
                })
                const index = applications.value.findIndex((a) => a.id === id)
                if (index !== -1) {
                    applications.value[index] = application
                } else {
                    applications.value.push(application)
                }
            } catch (e) {
                handleErrors(e)
            } finally {
                pending.value = false
            }
        }

        async function createComment(application: number, comment: ApplicationComment) {
            try {
                applications.value.find((a) => a.id === application)!.comments.push(comment)
                applications.value.find((a) => a.id === application)!.comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                await $fetch<ApplicationComment>(APPLICATION_COMMENTS_ENDPOINT(application), {
                    method: "POST",
                    body: JSON.stringify({ text: comment.text, created_by: comment.created_by.user_id, created_at: comment.created_at, updated_at: comment.updated_at }),
                    headers: {
                        Authorization: `Token ${authStore.token}`,
                    },
                })
                await getApplications()
            } catch (e) {
                handleErrors(e)
            }
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
                await getApplications()
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

        return {
            applications,
            getApplications,
            getApplication,
            applicationById,
            createComment,
            updateApplication,
            createApplication,
            pending,
        }
    },
    {
        persist: {
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
