import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";
import Process from "process";

test.describe("Классификатор групп критериев",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({groupClassifier}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${new Date().toLocaleString()}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`}
        );
        await test.step("Добавление группы критериев",async () => await groupClassifier.addGroup());
        await test.step("Изменение группы критериев",async () => await groupClassifier.changeGroup());
        await test.step("Удаление группы критериев",async () => await groupClassifier.deleteGroup());
    })
})