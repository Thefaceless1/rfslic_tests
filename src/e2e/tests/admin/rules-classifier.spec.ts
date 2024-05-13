import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Классификатор критериев и документов",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({rulesClassifier}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );

            await test.step(
                "Добавление версии списка критериев и документов",
                async () => await rulesClassifier.addRule()
            );
            await test.step(
                "Редактирование версии списка критериев и документов",
                async () => await rulesClassifier.editRule()
            );
            await test.step(
                "Добавление групп критериев",
                async () => await rulesClassifier.addCriteriaGroups()
            );
            await test.step(
                "Добавление критериев",
                async () => await rulesClassifier.addCriterias()
            );
            await test.step(
                "Публикация версии списка критериев и документов",
                async () => await rulesClassifier.publishRule()
            );
            await test.step(
                "Снятие с публикации версии списка критериев и документов",
                async () => await rulesClassifier.unpublishRule()
            );
            await test.step(
                "Создание версии списка критериев и документов по образцу",
                async () => await rulesClassifier.cloneRule()
            );
            await test.step(
                "Удаление версии списка критериев и документов",
                async () => await rulesClassifier.deleteRule()
            );
        })
})