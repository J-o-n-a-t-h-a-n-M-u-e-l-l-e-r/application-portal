<script setup lang="ts">
defineEmits(["account-created"])
</script>

<template>
    <div>
        <Tabs default-value="student">
            <TabsList>
                <TabsTrigger value="student"> Student</TabsTrigger>
                <TabsTrigger value="staff"> Staff</TabsTrigger>
            </TabsList>
            <TabsContent value="student">
                <CreateStudentAccount @account-created="$emit('account-created')" />
            </TabsContent>
            <TabsContent value="staff">
                <CreateStaffAccount @account-created="$emit('account-created')" />
            </TabsContent>
        </Tabs>
    </div>
</template>

<style scoped></style>
