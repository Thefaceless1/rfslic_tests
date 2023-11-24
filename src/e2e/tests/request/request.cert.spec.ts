import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";
import Process from "process";
import {LicStatus} from "../../page-objects/helpers/enums/licstatus.js";
import config from "../../../../playwright.config.js";

test.describe("Заявки на аттестацию",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({certRequests}) => {
            test.info().annotations.push
            (
                {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
                {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
                {type: "Адрес сервера",description: `${config.use?.baseURL}`}
            );
            await test.step(
                "Создание заявки на аттестацию в статусе Черновик",
                async () => await certRequests.createDraft("cert")
            );
            await test.step(
                "Подача заявки на аттестацию",
                async () => await certRequests.publishLic()
            );
            await test.step(
                "Изменение сроков подачи и рассмотрения документации",
                async () => await certRequests.updateDeadlineOfDates("cert")
            );
            await test.step(
                "Добавление экспертов и сотрудников для групп критериев",
                async () => await certRequests.addExperts()
            );
            await test.step(
                "Заполнение документов критериев, сотрудников и офи",
                async () => await certRequests.addDocInfo()
            );
            await test.step(
                "Добавление комментариев и решений по документам экспертами групп критериев",
                async () => await certRequests.addExpertInfo("cert")
            );
            await test.step(
                "Добавление решения по заявке на аттестацию",
                async () => await certRequests.addConclusions("cert")
            );
            await test.step(
                "Проставление статуса 'Ожидает решения комиссии'",
                async () => await certRequests.editLicStatus(LicStatus.waitForCommission)
            );
            await test.step(
                "Вынесение решения комиссии по заявке на аттестацию",
                async () => await certRequests.addCommissionDecision("cert")
            );
        })
})