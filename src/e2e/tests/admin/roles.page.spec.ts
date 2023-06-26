import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Роли",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${InputData.moduleVersion}`,
        async ({roles}) => {
        test.info().annotations.push({type: "Дата и время запуска",description: `${new Date().toLocaleString()}`});
        test.info().annotations.push({type: "Версия модуля",description: `${InputData.moduleVersion}`});
        await test.step("Добавление роли",async () => await roles.addRole());
        await test.step("Изменение прав роли",async () => await roles.changeRoleRights("roles"));
        await test.step("Удаление роли",async () => await roles.deleteRole());
    })
})