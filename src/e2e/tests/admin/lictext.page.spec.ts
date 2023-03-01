import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("License texts", () => {
    /**
     * 1. Adding a license text
     */
    test("License texts scenario", async ({licenseText},testInfo) => {
        await licenseText.addLicText();
        expect(testInfo.status).toBe("passed");
    })
})