import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import Process from "process";
import config from "../../../../playwright.config.js";

test.describe("Справочник 'Группы итоговых документов",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({finalDocumentsGroups}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step(
                "Проверка возможности добавления записи в справочник",
                async () => {
                    if(!await finalDocumentsGroups.canAddEntry()) {
                        await test.info().attach("Уведомление",{body: "В справочник уже добавлено максимально возможное количество записей"})
                        test.skip();
                    }
                }
            );
            await test.step(
                "Добавление записи в справочник",
                async () => await finalDocumentsGroups.addFinalDocumentGroup()
            );
            await test.step(
                "Удаление записи из справочника",
                async () => await finalDocumentsGroups.deleteFinalDocumentGroup()
            );
        })
})