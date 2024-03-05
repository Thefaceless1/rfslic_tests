import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Справочник 'Санкции'",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({sanctions}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );

            await test.step(
                "Добавление санкции",
                async () => await sanctions.addSanction()
            );
            await test.step(
                "Изменение сумм штрафов для санкции",
                async () => await sanctions.changeFineAmount()
            );
            await test.step(
                "Удаление санкции",
                async () => await sanctions.deleteSanction()
            );
        })
})