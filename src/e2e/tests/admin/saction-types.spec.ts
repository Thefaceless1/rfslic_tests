import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Справочник 'Виды санкций'",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({sanctionTypes}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );

            await test.step(
                "Добавление вида санкции",
                async () => await sanctionTypes.addSanctionType()
            );
            await test.step(
                "Изменение вида санкции",
                async () => await sanctionTypes.changeSanctionType()
            );
            await test.step(
                "Удаление вида санкции",
                async () => await sanctionTypes.deleteSanctionType()
            );
        })
})