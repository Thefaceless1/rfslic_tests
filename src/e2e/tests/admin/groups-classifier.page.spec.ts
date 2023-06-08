import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Классификатор групп критериев",() => {
    test("Сценарий проверки: " +
        "1. Добавление группы критериев " +
        "2. Изменение группы критериев " +
        "3. Удаление группы критериев ",async ({groupClassifier}) => {
        await test.step("Добавление группы критериев",async () => await groupClassifier.addGroup());
        await test.step("Изменение группы критериев",async () => await groupClassifier.changeGroup());
        await test.step("Удаление группы критериев",async () => await groupClassifier.deleteGroup());
    })
})