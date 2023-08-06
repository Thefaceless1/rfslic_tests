import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";
import Process from "process";

test.describe("Классификатор разрядов критериев",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({categoriesClassifier}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${new Date().toLocaleString()}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`}
        );
        await test.step("Добавление разряда критерия",async () => await categoriesClassifier.addCategory());
        await test.step("Изменение разряда критерия",async () => await categoriesClassifier.changeCategory());
        await test.step("Удаление разряда критерия",async () => await categoriesClassifier.deleteCategory());
    })
})