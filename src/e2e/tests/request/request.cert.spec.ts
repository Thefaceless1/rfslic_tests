import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/InputData.js";
import Process from "process";
import {LicStates} from "../../page-objects/helpers/enums/LicStates.js";
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
                async () => await certRequests.createRequestDraft("cert")
            );
            await test.step(
                "Подача заявки на аттестацию",
                async () => await certRequests.submitLicenseRequest("cert")
            );
            await test.step(
                "Изменение сроков подачи и рассмотрения документации",
                async () => await certRequests.updateDeadlineOfDates("cert")
            );
            await test.step(
                "Изменение количества отправок документов на проверку",
                async () => await certRequests.changeVerificationDocsCount()
            );
            await test.step(
                "Добавление экспертов и сотрудников для групп критериев",
                async () => await certRequests.addExperts()
            );
            await test.step(
                "Заполнение и отправка на проверку документов критериев, добавление сотрудников и офи(в т.ч отсутствующих)",
                async () => await certRequests.fillRequestEntities("cert",false)
            );
            await test.step(
                "Добавление комментариев, решений по документам, формирование отчета для экспертов групп критериев",
                async () => await certRequests.addExpertSolution("cert",false)
            );
            await test.step(
                "Добавление решения по заявке на аттестацию",
                async () => await certRequests.addConclusions("cert")
            );
            await test.step(
                "Проставление статуса 'Ожидает решения комиссии'",
                async () => await certRequests.editLicStatus(LicStates.waitForCommission)
            );
            await test.step(
                "Вынесение решения комиссией по заявке на аттестацию",
                async () => await certRequests.addCommissionDecision("cert",false)
            );
            await test.step(
                "Получение заявкой признака 'Содержит актуальные сведения'",
                async () => await certRequests.checkRequestAttributes(false)
            );
            await test.step(
                "Подача заявки на изменение",
                    async () => await certRequests.addRequestForChange()
            );
            await test.step(
                "Заполнение и отправка на проверку изменяемых документов, удаленных и добавленных участников, в заявке на изменение",
                async () => await certRequests.fillRequestEntities("cert", true)
            );
            await test.step(
                "Добавление решений по документам, добаляемым отсутствующим удаляемым участникам/офи, формирование отчета эксперта",
                async () => await certRequests.addExpertSolution("cert",true)
            );
            await test.step(
                "Проставление статуса 'Ожидает решения комиссии' для заявки на изменение",
                async () => await certRequests.editLicStatus(LicStates.waitForCommission)
            );
            await test.step(
             "Вынесение решения комиссией по заявке на изменение",
                async () => await certRequests.addCommissionDecision("cert",true)
            );
            await test.step(
                "Потеря заявкой атрибута 'заявка на изменение' и приобретение атрибута 'содержит актуальные сведения'",
                async () => await certRequests.checkRequestAttributes(true)
            );
            await test.step(
                "Наличие в итоговой заявке добавленного ОФИ и отсутствие удаленного участника",
                async () => await certRequests.checkRemovedAndAddedEntities()
            );
            await test.step(
                "Наличие в итоговой заявки документов, ОФИ и Участников, импортированных из актуальной заявки",
                async () => await certRequests.checkImportedEntities()
            );
        })
})