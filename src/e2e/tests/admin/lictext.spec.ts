import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Тексты итоговых документов", () => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({licenseText}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );

        await test.step(
            "Добавление текста для итогового документа",
            async () => await licenseText.addLicText()
        );
    })
})