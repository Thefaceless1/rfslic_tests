import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Пользователи",() => {
    test.describe.configure({mode : "serial"});
    test.only("Добавление нового пользователя",async ({users}) => {
        await users.addUser();
    })
})