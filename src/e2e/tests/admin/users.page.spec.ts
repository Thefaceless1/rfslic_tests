import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Users",() => {
    /**
     * 1. Adding a new user
     * 2. Editing user rights
     * 3. Changing the role assigned to a user
     * 4. Editing user criteria groups
     */
    test("Users scenario",async ({users},testInfo) => {
        await users.addUser();
        await users.changeRoleRights();
        await users.changeUserRole();
        await users.changeUserGrpCrit();
        expect(testInfo.status).toBe("passed");
    })
})