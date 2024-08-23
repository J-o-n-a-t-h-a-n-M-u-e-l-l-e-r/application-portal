<script setup lang="ts">
import { PAGE_SIZE } from "assets/constants"
import Pencil2Icon from "~/components/icons/Pencil-2-Icon.vue"

const applicationsStore = useApplicationsStore()
const appDataStore = useAppDataStore()
const networkStore = useNetworkStore()
const currentPage = ref(applicationsStore.loadCurrentPage())

onMounted(() => {
    currentPage.value = applicationsStore.loadCurrentPage()
    applicationsStore.getApplications(currentPage.value)
})

watch(currentPage, (newPage) => {
    applicationsStore.getApplications(newPage)
    applicationsStore.saveCurrentPage(newPage)
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
            <TableBody v-if="applicationsStore.applicationPageMap[currentPage] === undefined">
                <TableRow v-for="n in PAGE_SIZE" :key="n">
                    <TableCell colspan="6">
                        <Skeleton class="h-10 w-full" />
                    </TableCell>
                </TableRow>
            </TableBody>
            <TableBody v-else>
                <TableRow v-for="application in applicationsStore.getApplicationsByPage(currentPage)" :key="application.id">
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
        <Pagination
            v-slot="{ page }"
            :page="currentPage"
            :total="applicationsStore.count"
            :items-per-page="PAGE_SIZE"
            :sibling-count="5"
            :default-page="1"
            class="flex justify-center"
            show-edges
            @update:page="currentPage = $event"
        >
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                <template v-for="(item, index) in items">
                    <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                        <Button
                            class="w-10 h-10 p-0"
                            :variant="item.value === page ? 'default' : 'outline'"
                            :disabled="applicationsStore.getApplicationsByPage(item.value).length === 0 && !networkStore.isOnline"
                            @click="currentPage = item.value"
                        >
                            {{ item.value }}
                        </Button>
                    </PaginationListItem>
                    <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>
            </PaginationList>
        </Pagination>
    </div>
</template>

<style scoped></style>
