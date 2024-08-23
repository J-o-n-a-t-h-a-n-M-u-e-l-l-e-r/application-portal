<script setup lang="ts">
defineProps<{ student: Student }>()
</script>

<template>
    <div>
        <h2>Student</h2>
        <div class="flex">
            <div class="w-1/2">
                <p data-testid="application-student-name">
                    Name: {{ student.first_name + " " + student.last_name }}<br />
                    Email: {{ student.email }}<br />
                    Phone: {{ student.phone }}
                </p>
            </div>
            <div class="w-1/2">
                <p>
                    Address: {{ student.address }}<br />
                    Birthday: {{ student.birth_date }}<br />
                    Current degree: {{ student.current_degree }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
