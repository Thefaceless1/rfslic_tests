import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Пользователи",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({users}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );

        await test.step(
            "Добавление нового пользователя",
            async () => await users.addUser()
        );
        await test.step(
            "Редактирование прав пользователя",
            async () => await users.changeRoleRights("users")
        );
        await test.step(
            "Изменение роли пользователя",
            async () => await users.changeUserRole()
        );
        await test.step(
            "Редактирование групп критериев пользователя",
            async () => await users.changeUserGrpCrit()
        );
    })
})