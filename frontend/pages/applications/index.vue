<script setup lang="ts">
import Pencil2Icon from "~/components/icons/Pencil-2-Icon.vue"

const applicationsStore = useApplicationsStore()
const appDataStore = useAppDataStore()

onMounted(() => {
    applicationsStore.getApplications()
})
</script>

<template>
    <div>
        <h1>Applications</h1>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead> Student</TableHead>
                    <TableHead> Status</TableHead>
                    <TableHead> Subject</TableHead>
                    <TableHead> Description</TableHead>
                    <TableHead> Created At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody v-if="applicationsStore.pending && applicationsStore.applications.length === 0">
                <TableRow>
                    <TableCell colspan="6">
                        <Skeleton class="h-10 w-full" />
                    </TableCell>
                </TableRow>
            </TableBody>
            <TableBody v-else>
                <TableRow v-for="application in applicationsStore.applications" :key="application.id">
                    <TableCell>{{ application.student.first_name + " " + application.student.last_name }}</TableCell>
                    <TableCell>{{ application.status }}</TableCell>
                    <TableCell>{{ application.subject }}</TableCell>
                    <TableCell>{{ application.description }}</TableCell>
                    <TableCell>{{ appDataStore.formatDate(application.created_at) }}</TableCell>
                    <TableCell class="text-right">
                        <NuxtLink :to="`/applications/${application.id}`">
                            <Button variant="outline" size="icon" data-testid="edit-application">
                                <Pencil2Icon />
                            </Button>
                        </NuxtLink>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
</template>

<style scoped></style>
