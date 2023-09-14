import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {LicStatus} from "../../page-objects/helpers/enums/licstatus.js";
import * as Process from "process";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Заявки на лицензирование", () => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({licRequests}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`}
        );

        await test.step(
            "Создание заявки на лицензирование в статусе Черновик",
            async () => await licRequests.createDraft("lic")
        );
        await test.step(
            "Подача заявки на лицензирование",
            async () => await licRequests.publishLic()
        );
        await test.step(
            "Изменение сроков подачи и рассмотрения документации",
            async () => await licRequests.updateDeadlineOfDates("lic")
        );
        await test.step(
            "Добавление экспертов и сотрудников для групп критериев",
            async () => await licRequests.addExperts()
        );
        await test.step(
            "Заполнение документов критериев, сотрудников и офи",
            async () => await licRequests.addDocInfo()
        );
        await test.step(
            "Добавление комментариев и решений по документам экспертов групп критериев",
            async () => await licRequests.addExpertInfo("lic")
        );
        await test.step(
            "Добавление решения по заявке на лицензирование",
            async () => await licRequests.addConclusions("lic")
        );
        await test.step(
            "Проставление статуса 'Ожидает решения комиссии'",
            async () => await licRequests.editLicStatus(LicStatus.waitForCommission)
        );
        await test.step(
            "Вынесение решения комиссии по заявке на лицензирование",
            async () => await licRequests.addCommissionDecision("lic")
        );
    })
})