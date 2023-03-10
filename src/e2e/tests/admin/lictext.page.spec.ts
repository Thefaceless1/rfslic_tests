import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("License texts", () => {
    test("License texts scenario", async ({licenseText},testInfo) => {
        await test.step("Adding a license text",async () => await licenseText.addLicText());
        expect(testInfo.status).toBe("passed");
    })
})