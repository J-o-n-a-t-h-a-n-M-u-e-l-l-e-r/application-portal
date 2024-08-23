import { type Ref, ref } from "vue"

export function useWebWorkerManager() {
    const workers: Ref<{ id: number; worker: Worker }[]> = ref([])

    function createWorker() {
        const worker = new Worker(new URL("../public/documentWorker.js", import.meta.url), { type: "module" })
        const id = workers.value.length

        workers.value.push({ id, worker })
        return worker
    }

    function terminateWorker(worker: Worker) {
        const index = workers.value.findIndex((w) => w.worker === worker)
        if (index !== -1) {
            workers.value[index].worker.terminate()
            workers.value.splice(index, 1)
        }
    }

    function terminateAllWorkers() {
        workers.value.forEach((w) => w.worker.terminate())
        workers.value = []
    }

    return { createWorker, terminateWorker, terminateAllWorkers }
}
