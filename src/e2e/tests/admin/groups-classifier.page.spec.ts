import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Классификатор групп критериев",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${InputData.moduleVersion}`,
        async ({groupClassifier}) => {
        test.info().annotations.push({type: "Дата и время запуска",description: `${new Date().toLocaleString()}`});
        test.info().annotations.push({type: "Версия модуля",description: `${InputData.moduleVersion}`});
        await test.step("Добавление группы критериев",async () => await groupClassifier.addGroup());
        await test.step("Изменение группы критериев",async () => await groupClassifier.changeGroup());
        await test.step("Удаление группы критериев",async () => await groupClassifier.deleteGroup());
    })
})