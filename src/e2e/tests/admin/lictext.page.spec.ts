import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Тексты лицензий", () => {
    test("Сценарий проверки: " +
        "1. Добавление текста для типа лицензии", async ({licenseText}) => {
        await test.step("Добавление текста для типа лицензии",async () => await licenseText.addLicText());
    })
})