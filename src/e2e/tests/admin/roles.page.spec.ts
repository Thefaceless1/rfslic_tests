import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Roles",() => {
    test.beforeAll(async ({setUser}) => {
        await setUser.createUser();
    })
    test("Adding a role",async ({roles}) => {
        await roles.addRole();
        await expect(roles.notifyByEnum(Notifications.roleSaved)).toBeVisible();
    })
    test("Changing role rights", async ({roles}) => {
        await roles.addRole();
        await roles.changeRoleRights();
        await expect(roles.notifyByEnum(Notifications.roleRightsChanged)).toBeVisible();
    })
})