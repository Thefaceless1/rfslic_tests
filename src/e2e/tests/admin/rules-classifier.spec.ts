import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Справочник 'Классификатор правил'",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({rulesClassifier}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );

            await test.step(
                "Добавление правила",
                async () => await rulesClassifier.addRule()
            );
            await test.step(
                "Редактирование правила",
                async () => await rulesClassifier.editRule()
            );
            await test.step(
                "Публикация версии правил",
                async () => await rulesClassifier.publishRule()
            );
            await test.step(
                "Снятие с публикации версии правил",
                async () => await rulesClassifier.unpublishRule()
            );
            await test.step(
                "Создание версии правил по образцу",
                async () => await rulesClassifier.cloneRule()
            );
            await test.step(
                "Удаление версии правил",
                async () => await rulesClassifier.deleteRule()
            );
        })
})