import { expect, test } from "@playwright/test"

// Page to be tested
const appURL = "localhost:3000/"
// appURLs for experiments
// const appURL = "https://application-portal.ENTER_DOMAIN.de/"
// const appURL = "https://application-portal.ENTER_DOMAIN.de/applications/1"
// const appURL = "https://nopwa.ENTER_DOMAIN.de/"
// const appURL = "https://nopwa.ENTER_DOMAIN.de/applications/1"
// const appURL = "https://application-portal.ENTER_DOMAIN.de/account"

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
