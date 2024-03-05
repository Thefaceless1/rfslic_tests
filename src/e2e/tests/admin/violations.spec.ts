import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Справочник 'Нарушения'",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({violations}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );

            await test.step(
                "Добавление нарушения",
                async () => await violations.addViolation()
            );
            await test.step(
                "Изменение нарушения",
                async () => await violations.changeViolation()
            );
            await test.step(
                "Удаление нарушения",
                async () => await violations.deleteViolation()
            );
        })
})