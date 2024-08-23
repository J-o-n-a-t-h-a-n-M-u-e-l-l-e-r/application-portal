<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { useForm } from "vee-validate"
import { useToast } from "~/components/ui/toast"

const applicationsStore = useApplicationsStore()
const authStore = useAuthStore()
const { toast } = useToast()
const files: Ref<File[]> = ref([])

const formSchema = toTypedSchema(
    z.object({
        subject: z.enum(["COMPUTER_SCIENCE", "MATH", "PHYSICS", "CHEMISTRY", "BIOLOGY", "ECONOMICS"]),
        description: z.string().min(1),
        files: z.array(z.any()),
    }),
)

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        subject: "COMPUTER_SCIENCE",
        description: "",
        files: [],
    },
})

const handleFiles = (event: Event) => {
    const target = event.target as HTMLInputElement
    files.value = files.value.concat(Array.from(target.files!))
}

const handleSubmission = handleSubmit(async (values, { resetForm }) => {
    const formData = new FormData()
    formData.append("student_id", String(authStore.user!.student_profile!.user_id))
    formData.append("created_at", new Date().toISOString())
    formData.append("id", String(authStore.getLocalID()))
    formData.append("updated_at", new Date().toISOString())
    formData.append("subject", String(values.subject))
    formData.append("description", String(values.description))
    for (let i = 0; i < files.value.length; i++) {
        formData.append("files", files.value[i])
    }
    applicationsStore
        .createApplication(formData)
        .then(() => {
            toast({
                title: "Application Created",
                description: "Your application has been created",
            })
        })
        .catch(() => {
            toast({
                title: "Application Creation Failed",
                description: "An error occurred while creating your application",
                variant: "destructive",
            })
        })
        .finally(() => {
            resetForm()
        })
})

const clearFiles = (event: Event) => {
    const formEvent = event.target as HTMLFormElement
    files.value = []
    formEvent.reset()
}

const createApplication = async (event: Event) => {
    await handleSubmission(event)
    clearFiles(event)
}
</script>

<template>
    <form class="space-y-6" @submit.prevent="createApplication">
        <h2>Create Application</h2>
        <FormField v-slot="{ componentField }" name="subject">
            <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select v-bind="componentField">
                    <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a Subject" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="COMPUTER_SCIENCE">Computer Science</SelectItem>
                            <SelectItem value="MATH">Math</SelectItem>
                            <SelectItem value="PHYSICS">Physics</SelectItem>
                            <SelectItem value="CHEMISTRY">Chemistry</SelectItem>
                            <SelectItem value="BIOLOGY">Biology</SelectItem>
                            <SelectItem value="ECONOMICS">Economics</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="description">
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="Enter Description" v-bind="componentField" class="resize-none" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField name="files">
            <FormItem>
                <FormLabel>Files</FormLabel>
                <FormControl>
                    <Input type="file" multiple="multiple" class="cursor-pointer" @change="handleFiles" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <Button type="submit">Create Application</Button>
    </form>
</template>

<style scoped></style>
