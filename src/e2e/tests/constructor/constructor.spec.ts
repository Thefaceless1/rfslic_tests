import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
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
            "Добавление версии правил для пролицензии",
            async () => await constructor.addRuleVersionForProlicense()
        );
        await test.step(
            "Добавление экспертов для групп критериев",
            async () => await constructor.addExperts()
        );
        await test.step(
            "Заполнение поля 'Минимальное количество' критерия",
            async () => await constructor.addMinimumCount()
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
            "Снятие с публикации пролицензии",
            async () => await constructor.unpublishProlicense()
        );
    })
})