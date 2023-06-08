import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Пролицензии", () => {
    test("Сценарий проверки: " +
        "1. Создание пролицензии " +
        "2. Изменение общей информации пролицензии " +
        "3. Добавление групп критериев" +
        "4. Добавление критериев и документов " +
        "5. Создание пролицензии по образцу" +
        "6. Удаление пролицензии " +
        "7. Публикация пролицензии " +
        "8. Снятие с публикации пролицензии",async ({constructor}) => {
        await test.step("Создание пролицензии",async () => await constructor.createProlicense());
        await test.step("Изменение общей информации пролицензии",async () => await constructor.changeBasicInfo());
        await test.step("Добавление групп критериев",async () => await constructor.createGrpCrit());
        await test.step("Добавление критериев и документов",async () => await constructor.createCriteria());
        await test.step("Создание пролицензии по образцу",async () => await constructor.cloneProlicense());
        await test.step("Удаление пролицензии",async () => await constructor.deleteProlicense());
        await test.step("Публикация пролицензии",async () => await constructor.publishProlicense("prolic"));
        await test.step("Снятие с публикации пролицензии",async () => await constructor.unpublishProlicense());
    })
})