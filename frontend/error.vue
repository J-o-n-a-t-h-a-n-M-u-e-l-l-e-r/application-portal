<script setup lang="ts">
defineProps<{ error: string }>()

const handleClearError = () => clearError({ redirect: "/" })
</script>

<template>
    <div>
        <h1>Error</h1>
        <p>{{ error }}</p>
        <button @click="handleClearError">Clear Error</button>
    </div>
</template>

<style scoped></style>
