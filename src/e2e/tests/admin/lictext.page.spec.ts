import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Тексты лицензий", () => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${InputData.moduleVersion}`,
        async ({licenseText}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${new Date().toLocaleString()}`},
            {type: "Версия модуля",description: `${InputData.moduleVersion}`}
        );
        await test.step("Добавление текста для типа лицензии",async () => await licenseText.addLicText());
    })
})