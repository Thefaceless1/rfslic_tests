import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Roles",() => {
    test("Roles scenario",async ({roles},testInfo) => {
        await test.step("Adding a role",async () => await roles.addRole());
        await test.step("Changing role rights",async () => await roles.changeRoleRights());
        await test.step("Removing a role",async () => await roles.deleteRole());
        expect(testInfo.status).toBe("passed");
    })
})