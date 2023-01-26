import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Роли",() => {
    test("Добавление роли",async ({roles}) => {
        await roles.addRole();
        await expect(roles.notifyByEnum(Notifications.roleSaved)).toBeVisible();
    })
    test("Изменение прав роли", async ({roles}) => {
        await roles.addRole();
        await roles.changeRoleRights();
        await expect(roles.notifyByEnum(Notifications.roleRightsChanged)).toBeVisible();
    })
})