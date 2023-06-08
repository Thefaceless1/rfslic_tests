import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Классификатор разрядов критериев",() => {
    test("Сценарий проверки: " +
        "1. Добавление разряда критерия " +
        "2. Изменение разряда критерия " +
        "3. Удаление разряда критерия"
        ,async ({categoriesClassifier}) => {
        await test.step("Добавление разряда критерия",async () => await categoriesClassifier.addCategory());
        await test.step("Изменение разряда критерия",async () => await categoriesClassifier.changeCategory());
        await test.step("Удаление разряда критерия",async () => await categoriesClassifier.deleteCategory());
    })
})