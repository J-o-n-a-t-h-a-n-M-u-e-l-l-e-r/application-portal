self.addEventListener("message", async (e) => {
    const { apiUrl, files } = e.data

    for (let file of files) {
        try {
            const response = await fetch(apiUrl + file.file)
            await response.blob()
        } catch (error) {
            console.error(error)
            self.postMessage({ error: true })
            return
        }
    }

    self.postMessage({ type: "FILES_FETCHED" })
})
