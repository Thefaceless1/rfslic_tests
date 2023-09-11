import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";
import Process from "process";
import {LicStatus} from "../../page-objects/helpers/enums/licstatus.js";

test.describe("Заявки на фин. контроль",() => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({finRequests}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`}
        );
            await test.step(
                "Создание заявки на фин. контроль в статусе Черновик",
                async () => await finRequests.createDraft("fin")
            );
            await test.step(
                "Подача заявки на фин. контроль",
                async () => await finRequests.publishLic()
            );
            await test.step(
                "Изменение сроков подачи и рассмотрения документации",
                async () => await finRequests.updateDeadlineOfDates("fin")
            );
            await test.step(
                "Добавление членов рабочей группы и сотрудников для групп критериев",
                async () => await finRequests.addExperts()
            );
            await test.step(
                "Заполнение документов критериев, сотрудников и офи",
                async () => await finRequests.addDocInfo()
            );
            await test.step(
                "Добавление комментариев и решений по документам членами рабочей группы",
                async () => await finRequests.addExpertInfo("fin")
            );
            await test.step(
                "Добавление решения по заявке на фин. контроль",
                async () => await finRequests.addConclusions("fin")
            );
            await test.step(
                "Проставление статуса 'Ожидает решения комиссии'",
                async () => await finRequests.editLicStatus(LicStatus.waitForCommission)
            );
            await test.step(
                "Вынесение решения комиссии по заявке на фин. контроль",
                async () => await finRequests.addCommissionDecision("fin")
            );
    })
})
