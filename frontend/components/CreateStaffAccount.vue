<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { useForm } from "vee-validate"
import { useToast } from "~/components/ui/toast"

const authStore = useAuthStore()

const emit = defineEmits(["account-created"])
const { toast } = useToast()
const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(1),
        password: z.string().min(5),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        position: z.string().min(1),
        department: z.string().min(1),
        birth_date: z.string().date(),
    }),
)

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        department: "",
        birth_date: "",
    },
})

const createStaffAccount = handleSubmit(async (values, { resetForm }) => {
    const id = authStore.getLocalID()
    const staff: Staff = {
        created_at: new Date().toISOString(),
        user_id: id,
        email: values.email!,
        position: values.position!,
        department: values.department!,
        updated_at: new Date().toISOString(),
        birth_date: values.birth_date!,
        first_name: values.firstName!,
        last_name: values.lastName!,
    }
    const user: RegisterUser = {
        id: id,
        first_name: values.firstName!,
        last_name: values.lastName!,
        staff: staff,
        username: values.name!,
        email: values.email!,
    }
    authStore
        .register(user, values.password!)
        .then(() => {
            resetForm()
            toast({
                title: "Account Created",
                description: "Account created successfully! Please login.",
            })
            emit("account-created")
        })
        .catch(() => {
            toast({
                title: "Account Creation Failed",
                description: "An error occurred while creating your account",
                variant: "destructive",
            })
        })
})
</script>

<template>
    <form class="space-y-6" @submit.prevent="createStaffAccount">
        <FormField v-slot="{ componentField }" name="name">
            <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Enter Username" v-bind="componentField" autocomplete="on" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="password">
            <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="Enter Password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="firstName">
            <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Enter First Name" v-bind="componentField" autocomplete="given-name" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="lastName">
            <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Enter Last Name" v-bind="componentField" autocomplete="family-name" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="email">
            <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                    <Input type="email" placeholder="Enter Email" v-bind="componentField" autocomplete="email" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="position">
            <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Enter Position" v-bind="componentField" autocomplete="on" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="department">
            <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Enter Department" v-bind="componentField" autocomplete="on" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="birth_date">
            <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                    <Input type="date" placeholder="Enter Birth Date" v-bind="componentField" autocomplete="bday" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <Button class="" type="submit">Create</Button>
    </form>
</template>

<style scoped></style>
