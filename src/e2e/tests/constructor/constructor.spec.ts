import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";
import * as Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Пролицензии", () => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({constructor}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );

        await test.step(
            "Создание пролицензии",
            async () => await constructor.createProlicense("lic")
        );
        await test.step(
            "Изменение общей информации пролицензии",
            async () => await constructor.changeBasicInfo()
        );
        await test.step(
            "Добавление групп критериев",
            async () => await constructor.createGrpCrit()
        );
        await test.step(
            "Добавление критериев и документов",
            async () => await constructor.createCriteria()
        );
        await test.step(
            "Создание пролицензии по образцу",
            async () => await constructor.cloneProlicense()
        );
        await test.step(
            "Удаление пролицензии",
            async () => await constructor.deleteProlicense()
        );
        await test.step(
            "Публикация пролицензии",
            async () => await constructor.publishProlicense("prolic")
        );
        await test.step(
            "Изменение общей информации опубликованной пролицезии",
            async () => await constructor.changeBasicInfo()
        );
        await test.step(
            "Изменение критерия опубликованной пролицензии",
            async () => await constructor.changeCriteria()
        );
        await test.step(
            "Снятие с публикации пролицензии",
            async () => await constructor.unpublishProlicense()
        );
    })
})