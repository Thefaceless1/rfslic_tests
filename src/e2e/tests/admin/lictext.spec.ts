import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";

test.describe("License text", () => {
    test.beforeAll(async ({setUser}) => {
        await setUser.createUser();
    })
    test("Adding a license text", async ({licenseText}) => {
        await licenseText.addLicText();
        await expect(licenseText.notifyByEnum(Notifications.savedLicenseText)).toBeVisible();
    })
})