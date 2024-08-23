import fs from "fs"
import path from "path"
import { chromium, expect, test } from "@playwright/test"
import type { Page } from "playwright"
import { max } from "@floating-ui/utils"

// Page to be tested
const appURL = "localhost:3000/"
// appURLs for experiments
// const appURL = "https://application-portal.ENTER_DOMAIN.de/"
// const appURL = "https://application-portal.ENTER_DOMAIN.de/applications/1"
// const appURL = "https://nopwa.ENTER_DOMAIN.de/"
// const appURL = "https://nopwa.ENTER_DOMAIN.de/applications/1"
// const appURL = "https://application-portal.ENTER_DOMAIN.de/account"

let isPWA = true
if (appURL.includes("nopwa")) {
    isPWA = false
}

enum NetworkConditions {
    SLOW2G = "SLOW2G",
    G2 = "2G",
    G3 = "3G",
    G4 = "4G",
    AverageSpeed = "Average Mobile (Speedtest.net)",
}

type NetworkConditionDetails = {
    download: number
    upload: number
    latency: number
}

type NetworkConditionsType = {
    [key in NetworkConditions]: NetworkConditionDetails
}

test.describe("experiments", () => {
    // Configured network conditions
    const networkConditions: NetworkConditionsType = {
        [NetworkConditions.SLOW2G]: {
            download: 5625, // 0.045 Mbit/s
            upload: 5625, // 0.045 Mbit/s
            latency: 2200, // 2.2 s
        },
        [NetworkConditions.G2]: {
            download: 47000, // 0.376 Mbit/s
            upload: 47000, // 0.376 Mbit/s
            latency: 2000, // 2 s
        },
        [NetworkConditions.G3]: {
            download: 187500, // 1.5 Mbit/s
            upload: 187500, // 1.5 Mbit/s
            latency: 550, // 550 ms
        },
        [NetworkConditions.G4]: {
            download: 1250000, // 10 Mbit/s
            upload: 1250000, // 10 Mbit/s
            latency: 50, // 50 ms
        },
        [NetworkConditions.AverageSpeed]: {
            download: 7210000, // 57.68 Mbit/s
            upload: 1550000, // 12.40 Mbit/s
            latency: 26, // 26 ms
        },
    }

    // Create a new context and page with network conditions
    async function createContextAndPage(
        isFirstRun: boolean,
        tmpUserDataDir: string,
        requestInfo: {
            count: number
            totalSize: number
            objects: string[]
        },
        networkCondition: NetworkConditions,
    ) {
        const context = await chromium.launchPersistentContext(tmpUserDataDir, {
            headless: false,
        })
        // Listen to all requests and count them and their size
        context.on("request", (request) => {
            requestInfo.count++
            request.sizes().then((sizes) => {
                requestInfo.totalSize += max(sizes.responseBodySize, 0) + max(sizes.responseHeadersSize, 0) + max(sizes.requestHeadersSize, 0) + max(sizes.requestBodySize, 0)
            })
            requestInfo.objects.push(request.url())
        })
        const page = await context.newPage()
        // add 'auth' object to local storage for logged in state
        /*
        await page.addInitScript(() => {
            window.localStorage.setItem('name', 'value');
        });
        */
        const cdpsession = await page.context().newCDPSession(page)
        if (isFirstRun) {
            await cdpsession.send("Network.clearBrowserCache")
            await cdpsession.send("Network.clearBrowserCookies")
        }
        // If we would like to disable the default browser disk and memory cache
        // await cdpsession.send('Network.clearBrowserCache');
        // await cdpsession.send('Network.clearBrowserCookies');
        // await cdpsession.send('Network.setCacheDisabled', {cacheDisabled: true});

        // Set network conditions
        await cdpsession.send("Network.emulateNetworkConditions", {
            offline: false,
            latency: networkConditions[networkCondition].latency,
            downloadThroughput: networkConditions[networkCondition].download,
            uploadThroughput: networkConditions[networkCondition].upload,
        })
        return { context, page }
    }

    async function evaluatePerformance(csvFilePath: string, page: Page, requestInfo: { count: number; totalSize: number; objects: string[] }) {
        const performanceMetrics = {
            TTFB: 0,
            FCP: 0,
            LCP: 0,
            Duration: 0,
            DomInteractive: 0,
            NumberOfRequests: requestInfo.count,
            TotallyTransferredKBytes: requestInfo.totalSize / 1000,
        }
        // TTFB
        performanceMetrics.TTFB = await page.evaluate(() => {
            return new Promise((resolve) => {
                new PerformanceObserver((entryList) => {
                    const [pageNav] = entryList.getEntriesByType("navigation") as PerformanceNavigationTiming[]
                    console.log(`TTFB: ${pageNav.responseStart}`)
                    resolve(pageNav.responseStart)
                }).observe({ type: "navigation", buffered: true })
            })
        })
        // FCP
        performanceMetrics.FCP = await page.evaluate(() => {
            return new Promise((resolve) => {
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntriesByName("first-paint")) {
                        console.log(entry, entry.startTime)
                        resolve(entry.startTime)
                    }
                }).observe({ type: "paint", buffered: true })
            })
        })
        // LCP
        performanceMetrics.LCP = await page.evaluate(() => {
            return new Promise((resolve) => {
                new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        console.log(entry, entry.startTime)
                        resolve(entry.startTime)
                    }
                }).observe({ type: "largest-contentful-paint", buffered: true })
            })
        })
        // Navigation Timing
        const navigationTimingJson = await page.evaluate(() => JSON.stringify(performance.getEntriesByType("navigation")))
        console.log("Navigation Timing: ")
        // The total duration from the start of the navigation until the load event is fired, measured in milliseconds
        performanceMetrics.Duration = JSON.parse(navigationTimingJson)[0].duration
        console.log("Duration: ", JSON.parse(navigationTimingJson)[0].duration)
        // The time just before the user agent sets the document.readyState to interactive and the DOMContentLoaded event is fired.
        performanceMetrics.DomInteractive = JSON.parse(navigationTimingJson)[0].domInteractive
        console.log("DomInteractive: ", JSON.parse(navigationTimingJson)[0].domInteractive)

        console.log("Number of requests: ", requestInfo.count)
        console.log("Totally transferred kBytes: ", requestInfo.totalSize / 1000)

        // Write to CSV file
        // Convert the data object to a CSV string
        const csvLine =
            [
                performanceMetrics.TTFB.toString().replace(".", ","),
                performanceMetrics.FCP.toString().replace(".", ","),
                performanceMetrics.LCP.toString().replace(".", ","),
                performanceMetrics.Duration.toString().replace(".", ","),
                performanceMetrics.DomInteractive.toString().replace(".", ","),
                performanceMetrics.NumberOfRequests.toString(),
                performanceMetrics.TotallyTransferredKBytes.toString().replace(".", ","),
            ].join(";") + "\n"
        // Check if the file exists to write headers if necessary
        if (!fs.existsSync(csvFilePath)) {
            const headers = "TTFB;FCP;LCP;Duration;DomInteractive;NumberOfRequests;TotallyTransferredKBytes\n"
            fs.writeFileSync(csvFilePath, headers)
        }

        // Append the data to the file
        fs.appendFileSync(csvFilePath, csvLine)
    }

    // Experimental https://playwright.dev/docs/service-workers-experimental
    process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = "1"

    test("visit-application-twice", async () => {
        const testName = "visit-application-twice"
        for (const networkCondition of Object.values(NetworkConditions)) {
            const filePathRun1 = path.join(
                "../analysis/experiments/",
                testName + "-Run1-" + (isPWA ? "PWA" : "noPWA") + "-" + networkCondition + "-" + new Date().toISOString().replace(/:/g, "-") + ".csv",
            )
            const filePathRun2 = path.join(
                "../analysis/experiments/",
                testName + "-Run2-" + (isPWA ? "PWA" : "noPWA") + "-" + networkCondition + "-" + new Date().toISOString().replace(/:/g, "-") + ".csv",
            )
            for (let i = 0; i < 10; i++) {
                // Put favicon.ico already in requestInfo as Playwright does not fetch it
                const requestInfoRun1 = {
                    count: 1,
                    totalSize: 1213,
                    objects: ["favicon.ico"],
                }
                const requestInfoRun2 = {
                    count: 1,
                    totalSize: 1213,
                    objects: ["favicon.ico"],
                }
                const tmpUserDataDir = await fs.promises.mkdtemp(path.join("./temp/", "playwright-user-data-dir-"))
                const { context: context1, page: page1 } = await createContextAndPage(true, tmpUserDataDir, requestInfoRun1, networkCondition)
                await page1.goto(appURL)
                await page1.waitForLoadState("networkidle")

                await evaluatePerformance(filePathRun1, page1, requestInfoRun1)

                await page1.close()
                await context1.close()

                const { context: context2, page: page2 } = await createContextAndPage(false, tmpUserDataDir, requestInfoRun2, networkCondition)
                await page2.goto(appURL)
                await page2.waitForLoadState("networkidle")

                await evaluatePerformance(filePathRun2, page2, requestInfoRun2)

                await page2.close()
                await context2.close()

                await fs.promises.rm(tmpUserDataDir, { recursive: true, force: true })
            }
        }
    })
})

test.describe("simple online tests", () => {
    test.beforeEach(async ({ page }) => {
        const session = await page.context().newCDPSession(page)
        await session.send("Performance.enable")
        await page.goto(appURL)
        await page.waitForLoadState("networkidle")
        await page.getByPlaceholder("Enter Username").click()
        await page.getByPlaceholder("Enter Username").fill("Boss")
        await page.getByPlaceholder("Enter Password").click()
        await page.getByPlaceholder("Enter Password").fill("123456")
        await page.getByRole("button", { name: "Login" }).click()
        await page.waitForLoadState("networkidle")
        await expect(page.getByRole("heading", { name: "Application Portal" })).toBeVisible()
        console.log("=============CDP Performance Metrics===============")
        const performanceMetrics = await session.send("Performance.getMetrics")
        console.log(performanceMetrics.metrics)
    })

    test.afterEach(async ({ page }) => {
        await page.getByText("Logout").click()
        await expect(page.getByText("Login Register LoginEnter")).toBeVisible()
    })

    test("test changing application status", async ({ page }) => {
        await page.getByRole("link", { name: "Applications" }).click()
        await page.waitForTimeout(200)
        await page.getByTestId("edit-application").first().isVisible()
        const status = await page.locator("tbody").first().locator("td").nth(1).innerText()
        await page.getByTestId("edit-application").first().click()
        await expect(page.getByTestId("application-status")).toBeVisible()
        await expect(page.getByTestId("application-subject")).toBeVisible()
        await expect(page.getByTestId("application-student-name")).toBeVisible()
        await expect(page.locator("embed")).toBeVisible()
        await page.getByTestId("application-status").selectOption("WAITLISTED")
        await page.getByText("Applications").click()
        await expect(page.locator("tbody")).toContainText("WAITLISTED")
        await page.getByTestId("edit-application").first().click()
        await page.getByTestId("application-status").selectOption(status)
        await page.getByText("Applications").click()
        await page.waitForLoadState("networkidle")
        await expect(page.locator("tbody")).toContainText(status)
    })
})

test.describe("offline tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(appURL)
        await page.waitForLoadState("networkidle")
        await page.getByPlaceholder("Enter Username").click()
        await page.getByPlaceholder("Enter Username").fill("Boss")
        await page.getByPlaceholder("Enter Password").click()
        await page.getByPlaceholder("Enter Password").fill("123456")
        await page.getByRole("button", { name: "Login" }).click()
        await page.waitForLoadState("networkidle")
        await expect(page.getByRole("heading", { name: "Application Portal" })).toBeVisible()
        await expect(page.getByTestId("network-status")).toContainText("🟢")
        await page.getByRole("link", { name: "Applications" }).click()
        await expect(page.locator("h1")).toContainText("Applications")
        await page.reload({ waitUntil: "load", timeout: 60000 })
        await page.context().setOffline(true)
        await page.reload()
        await page.waitForTimeout(5000)
        await expect(page.getByTestId("network-status")).toContainText("🔴")
    })

    test.afterEach(async ({ page }) => {
        await page.context().setOffline(false)
        await page.reload()
        await page.getByText("Logout").click()
        await expect(page.getByText("Login Register LoginEnter")).toBeVisible()
    })

    test("all accessible under offline", async ({ page }) => {
        await page.getByTestId("edit-application").first().click()
        await expect(page.getByTestId("application-status")).toBeVisible()
        await expect(page.getByTestId("application-subject")).toBeVisible()
        await expect(page.getByTestId("application-student-name")).toBeVisible()
    })
})
