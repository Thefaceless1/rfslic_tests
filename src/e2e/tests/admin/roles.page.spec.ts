import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Роли",() => {
    test("Сценарий проверки: " +
        "1. Добавление роли " +
        "2. Изменение прав роли " +
        "3. Удаление роли",async ({roles}) => {
        await test.step("Добавление роли",async () => await roles.addRole());
        await test.step("Изменение прав роли",async () => await roles.changeRoleRights("roles"));
        await test.step("Удаление роли",async () => await roles.deleteRole());
    })
})