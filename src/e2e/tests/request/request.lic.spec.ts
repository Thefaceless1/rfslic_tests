import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {LicStates} from "../../page-objects/helpers/enums/LicStates.js";
import * as Process from "process";
import {InputData} from "../../page-objects/helpers/InputData.js";
import config from "../../../../playwright.config.js";

test.describe("Заявки на лицензирование", () => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({licRequests}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`},
            {type: "Адрес сервера",description: `${config.use?.baseURL}`}
        );

        await test.step(
            "Создание заявки на лицензирование в статусе Черновик",
            async () => await licRequests.createRequestDraft("lic")
        );
        await test.step(
            "Подача заявки на лицензирование",
            async () => await licRequests.submitLicenseRequest("lic")
        );
        await test.step(
            "Изменение сроков подачи и рассмотрения документации",
            async () => await licRequests.updateDeadlineOfDates("lic")
        );
        await test.step(
            "Изменение количества отправок документов на проверку",
            async () => await licRequests.changeVerificationDocsCount()
        );
        await test.step(
            "Добавление экспертов и сотрудников для групп критериев",
            async () => await licRequests.addExperts()
        );
        await test.step(
            "Заполнение и отправка на проверку документов критериев, добавление сотрудников и офи(в т.ч отсутствующих)",
            async () => await licRequests.fillRequestEntities("lic",false)
        );
        await test.step(
            "Добавление решений по документам, добаляемым отсутствующим участникам/офи, формирование отчета эксперта",
            async () => await licRequests.addExpertSolution("lic",false)
        );
        await test.step(
            "Ручное добавление санкции к заявке",
            async () => await licRequests.addSanction()
        );
        await test.step(
            "Удаление ручной санкции",
            async () => await licRequests.deleteSanction()
        );
        await test.step(
            "Формирование санкции в связи с возвратом отчета эксперта РФС на доработку",
            async () => await licRequests.formExpertReportSanction()
        );
        await test.step(
            "Добавление решения по заявке на лицензирование",
            async () => await licRequests.addConclusions("lic")
        );
        await test.step(
            "Проставление статуса 'Ожидает решения комиссии'",
            async () => await licRequests.editLicStatus(LicStates.waitForCommission)
        );
        await test.step(
            "Вынесение решения и утверждение санкций(в т.ч изменение суммы штрафа) комиссией по заявке на лицензирование",
            async () => await licRequests.addCommissionDecision("lic",false)
        );
        await test.step(
            "Просмотр утвержденных санкций на табе 'Комиссии' в заявке",
            async () => await licRequests.viewApprovedSanctions(false)
        );
        await test.step(
            "Получение заявкой признака 'Содержит актуальные сведения'",
            async () => await licRequests.checkRequestAttributes(false)
        );
        await test.step(
            "Подача заявки на изменение",
            async () => await licRequests.addRequestForChange()
        );
        await test.step(
            "Наличие импортированных рекомендаций по санкциям и утвержденных санкций из исходной заявки",
            async () => await licRequests.checkImportedSanctions()
        );
        await test.step(
            "Заполнение и отправка на проверку изменяемых документов, удаленных и добавленных участников, в заявке на изменение",
            async () => await licRequests.fillRequestEntities("lic", true)
        );
        await test.step(
            "Добавление решений по документам, добаляемым отсутствующим удаляемым участникам/офи, формирование отчета эксперта",
            async () => await licRequests.addExpertSolution("lic",true)
        );
        await test.step(
            "Ручное добавление санкции к заявке",
            async () => await licRequests.addSanction()
        );
        await test.step(
            "Проставление статуса 'Ожидает решения комиссии' для заявки на изменение",
            async () => await licRequests.editLicStatus(LicStates.waitForCommission)
        );
        await test.step(
            "Вынесение решения и утверждение санкций(в т.ч изменение суммы штрафа) комиссией по заявке на изменение",
            async () => await licRequests.addCommissionDecision("lic",true)
        );
        await test.step(
            "Просмотр утвержденных санкций на табе 'Комиссии' в заявке",
            async () => await licRequests.viewApprovedSanctions(true)
        );
        await test.step(
            "Потеря заявкой атрибута 'заявка на изменение' и приобретение атрибута 'содержит актуальные сведения'",
            async () => await licRequests.checkRequestAttributes(true)
        );
        await test.step(
            "Наличие в итоговой заявке добавленного ОФИ и отсутствие удаленного участника",
            async () => await licRequests.checkRemovedAndAddedEntities()
        );
        await test.step(
            "Наличие в итоговой заявки документов, ОФИ и Участников, импортированных из актуальной заявки",
            async () => await licRequests.checkImportedEntities()
        );
    })
})