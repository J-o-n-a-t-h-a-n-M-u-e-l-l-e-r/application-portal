<script setup lang="ts">
import UserLogin from "~/components/UserLogin.vue"
import UserRegister from "~/components/UserRegister.vue"

const currentTab = ref("login")
</script>

<template>
    <div class="flex justify-center items-center">
        <Tabs v-model="currentTab" default-value="login" class="w-[400px]">
            <TabsList>
                <TabsTrigger value="login"> Login</TabsTrigger>
                <TabsTrigger value="register"> Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter your credentials to login</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-2">
                        <UserLogin />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="register">
                <Card>
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>Enter your details to register</CardDescription>
                    </CardHeader>
                    <CardContent class="space-y-2">
                        <UserRegister @account-created="currentTab = 'login'" />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
</template>

<style scoped></style>
