import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Пользователи",() => {
    test.describe.configure({mode : "serial"});
    test("Добавление нового пользователя",async ({users}) => {
        await users.addUser();
        await expect(users.notifyByEnum(Notifications.userAdded)).toBeVisible();
    })
    test("Редактирование прав пользователя",async ({users}) => {
        await users.addUser();
        await users.changeRoleRights();
        await expect(users.notifyByEnum(Notifications.userRightsChanged)).toBeVisible();
    })
    test("Изменение роли, назначенной пользователю",async ({users}) => {
        await users.addUser();
        await users.changeUserRole();
        await expect(users.notifyByEnum(Notifications.userRoleChanged)).toBeVisible();
    })
    test("Редактирование групп критериев пользователя",async ({users}) => {
        await users.addUser();
        await users.changeUserGrpCrit();
        await expect(users.notifyByEnum(Notifications.userGrpCritChanged)).toBeVisible();
    })
})