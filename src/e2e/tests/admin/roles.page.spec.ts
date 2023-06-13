import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Роли",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${InputData.moduleVersion}`,
        async ({roles}) => {
        await test.step("Добавление роли",async () => await roles.addRole());
        await test.step("Изменение прав роли",async () => await roles.changeRoleRights("roles"));
        await test.step("Удаление роли",async () => await roles.deleteRole());
    })
})