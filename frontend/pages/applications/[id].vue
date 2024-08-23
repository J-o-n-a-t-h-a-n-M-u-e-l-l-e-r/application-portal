<script setup lang="ts">
const route = useRoute()
const applicationsStore = useApplicationsStore()
const appDataStore = useAppDataStore()
const application = computed(() => applicationsStore.applicationById(+route.params.id))

onMounted(() => {
    applicationsStore.getApplication(+route.params.id)
})
</script>

<template>
    <div v-if="application">
        <h1>Application</h1>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead class="w-[100px]"> Status</TableHead>
                    <TableHead> Description</TableHead>
                    <TableHead> Subject</TableHead>
                    <TableHead> Created At</TableHead>
                    <TableHead> Updated At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Select v-model="application.status" name="status" data-testid="application-status" @update:model-value="applicationsStore.updateApplication(application)">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                    <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </TableCell>
                    <TableCell>{{ application.description }}</TableCell>
                    <TableCell data-testid="application-subject">{{ application.subject }}</TableCell>
                    <TableCell>{{ appDataStore.formatDate(application.created_at) }}</TableCell>
                    <TableCell>{{ appDataStore.formatDate(application.updated_at) }}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        <StudentInformation :student="application.student" />
        <UserDocuments :files="application.files" />
        <UserComments :id="application.id" :comments="application.comments" />
    </div>
    <p v-else>Application not found</p>
</template>

<style scoped></style>
