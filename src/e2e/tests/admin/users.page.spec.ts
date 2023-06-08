import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Пользователи",() => {
    test("Сценарий проверки: " +
        "1. Добавление нового пользователя " +
        "2. Редактирование прав пользователя " +
        "3. Изменение роли пользователя " +
        "4. Редактирование групп критериев пользователя",async ({users}) => {
        await test.step("Добавление нового пользователя",async () => await users.addUser());
        await test.step("Редактирование прав пользователя",async () => await users.changeRoleRights("users"));
        await test.step("Изменение роли пользователя",async () => await users.changeUserRole());
        await test.step("Редактирование групп критериев пользователя",async () => await users.changeUserGrpCrit());
    })
})