<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import * as z from "zod"
import { useForm } from "vee-validate"
import { useToast } from "~/components/ui/toast"

const emit = defineEmits(["account-created"])
const authStore = useAuthStore()
const { toast } = useToast()
const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(1),
        password: z.string().min(5),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        address: z.string().min(1),
        birth_date: z.string().date(),
        current_degree: z.string().min(1),
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
        phone: "",
        address: "",
        birth_date: "",
        current_degree: "",
    },
})

const createStudentAccount = handleSubmit(async (values, { resetForm }) => {
    const id = authStore.getLocalID()
    const student: Student = {
        first_name: values.firstName!,
        last_name: values.lastName!,
        email: values.email!,
        created_at: new Date().toISOString(),
        user_id: id,
        updated_at: new Date().toISOString(),
        phone: values.phone!,
        address: values.address!,
        birth_date: values.birth_date!,
        current_degree: values.current_degree!,
    }
    const user: RegisterUser = {
        id: id,
        first_name: values.firstName!,
        last_name: values.lastName!,
        student: student,
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
    <form class="space-y-6" @submit.prevent="createStudentAccount">
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
        <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                    <Input type="tel" placeholder="Enter Phone" v-bind="componentField" autocomplete="tel" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="address">
            <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Enter Address" v-bind="componentField" autocomplete="street-address" />
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
        <FormField v-slot="{ componentField }" name="current_degree">
            <FormItem>
                <FormLabel>Current Degree</FormLabel>
                <FormControl>
                    <Input type="text" placeholder="Enter Current Degree" v-bind="componentField" autocomplete="on" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <Button class="" type="submit">Create</Button>
    </form>
</template>

<style scoped></style>
