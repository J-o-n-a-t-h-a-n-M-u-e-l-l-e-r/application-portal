<script setup lang="ts">
const props = defineProps<{ id: number; comments: Array<ApplicationComment> }>()
const applicationsStore = useApplicationsStore()
const appDataStore = useAppDataStore()
const authStore = useAuthStore()
const commentText = ref("")
const commentInputDisabled = ref(false)

const addComment = async () => {
    if (!commentText.value || !props.id || !props.comments || commentInputDisabled.value) return
    commentInputDisabled.value = true
    const comment: ApplicationComment = {
        text: commentText.value,
        created_by: authStore.user!.staff_profile!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        id: authStore.getLocalID(),
    }
    commentText.value = ""
    await applicationsStore.createComment(props.id, comment)
    commentInputDisabled.value = false
}
</script>

<template>
    <div>
        <h2>Comments</h2>
        <div>
            <div class="flex w-full items-baseline gap-1.5 mb-4 flex-wrap">
                <Input v-model="commentText" name="comment" :disabled="commentInputDisabled" placeholder="Add a comment" type="text" class="max-w-xs" @keyup.enter="addComment" />
                <Button class="mr-4" variant="outline" :disabled="commentInputDisabled" @click="addComment">Add</Button>
            </div>
            <div v-for="comment in props.comments" :key="comment.id" class="mb-3 p-3 border rounded-lg">
                <p>{{ comment.text }}</p>
                <div class="flex justify-start text-xs text-gray-500">
                    <pre>{{ comment.created_by.first_name + " " + comment.created_by.last_name }}</pre>
                    <Separator class="h-4 mx-2" orientation="vertical" />
                    <pre>{{ appDataStore.formatDate(comment.created_at) }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
