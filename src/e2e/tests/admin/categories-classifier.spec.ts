import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Справочник 'Классификатор разрядов критериев'",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({categoriesClassifier}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );

        await test.step(
            "Добавление разряда критерия",
            async () => await categoriesClassifier.addCategory()
        );
        await test.step(
            "Изменение разряда критерия",
            async () => await categoriesClassifier.changeCategory()
        );
        await test.step(
            "Удаление разряда критерия",
            async () => await categoriesClassifier.deleteCategory()
        );
    })
})