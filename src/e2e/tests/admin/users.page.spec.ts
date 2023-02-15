import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Users",() => {
    test.beforeAll(async ({setUser}) => {
        await setUser.createUser();
    })
    test.describe.configure({mode : "serial"});
    test("Adding a new user",async ({users}) => {
        await expect(users.notifyByEnum(Notifications.userAdded)).toBeVisible();
    })
    test("Editing user rights",async ({users}) => {
        await users.changeRoleRights();
        await expect(users.notifyByEnum(Notifications.userRightsChanged)).toBeVisible();
    })
    test("Changing the role assigned to a user",async ({users}) => {
        await users.changeUserRole();
        await expect(users.notifyByEnum(Notifications.userRoleChanged)).toBeVisible();
    })
    test("Editing user criteria groups",async ({users}) => {
        await users.changeUserGrpCrit();
        await expect(users.notifyByEnum(Notifications.userGrpCritChanged)).toBeVisible();
    })
})