import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Roles",() => {
    /**
     * 1. Adding a role
     * 2. Changing role rights
     * 3. Removing a role
     */
    test.only("Roles scenario",async ({roles},testInfo) => {
        await roles.addRole();
        await roles.changeRoleRights();
        await roles.deleteRole();
        expect(testInfo.status).toBe("passed");
    })
})