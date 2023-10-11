import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Роли",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({roles}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );

        await test.step(
            "Добавление роли",
            async () => await roles.addRole()
        );
        await test.step(
            "Изменение прав роли",
            async () => await roles.changeRoleRights("roles")
        );
        await test.step(
            "Удаление роли",
            async () => await roles.deleteRole()
        );
    })
})