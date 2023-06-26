import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Пользователи",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${InputData.moduleVersion}`,
        async ({users}) => {
        test.info().annotations.push({type: "Дата и время запуска",description: `${new Date().toLocaleString()}`});
        test.info().annotations.push({type: "Версия модуля",description: `${InputData.moduleVersion}`});
        await test.step("Добавление нового пользователя",async () => await users.addUser());
        await test.step("Редактирование прав пользователя",async () => await users.changeRoleRights("users"));
        await test.step("Изменение роли пользователя",async () => await users.changeUserRole());
        await test.step("Редактирование групп критериев пользователя",async () => await users.changeUserGrpCrit());
    })
})