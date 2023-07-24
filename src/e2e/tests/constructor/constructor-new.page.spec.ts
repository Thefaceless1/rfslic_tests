import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Пролицензии", () => {
    test(`Дата запуска: ${InputData.currentDate}, Версия модуля: ${InputData.moduleVersion}`,
        async ({constructor}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${new Date().toLocaleString()}`},
            {type: "Версия модуля",description: `${InputData.moduleVersion}`}
        );
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