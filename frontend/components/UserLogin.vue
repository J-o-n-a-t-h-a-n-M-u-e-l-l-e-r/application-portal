<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { useForm } from "vee-validate"
import { useAuthStore } from "~/stores/AuthStore"
import ExclamationTriangle from "~/components/icons/Exclamation-Triangle.vue"

const auth = useAuthStore()
const router = useRouter()
const errorText = ref("")

const formSchema = toTypedSchema(
    z.object({
        username: z.string().min(1),
        password: z.string().min(5),
    }),
)

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        username: "",
        password: "",
    },
})

const login = handleSubmit(async (values, { setErrors }) => {
    errorText.value = ""
    auth.login(values.username!, values.password!)
        .then(async () => {
            if (auth.isAuthenticated) {
                await router.push("/")
            } else {
                errorText.value = "An error occurred while logging in."
            }
        })
        .catch((res) => {
            setErrors(res)
            errorText.value = res
        })
})
</script>

<template>
    <div>
        <form class="space-y-6" @submit.prevent="login">
            <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input type="text" placeholder="Enter Username" autocomplete="on" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="Enter Password" autocomplete="on" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>
            <Button class="" type="submit">Login</Button>
        </form>
        <Alert v-if="errorText" variant="destructive" class="max-w-2xl mt-4">
            <ExclamationTriangle class="h-4 w-4 mr-2" />
            <AlertTitle>An error occurred</AlertTitle>
            <AlertDescription>
                {{ errorText }}
            </AlertDescription>
        </Alert>
    </div>
</template>

<style scoped></style>
