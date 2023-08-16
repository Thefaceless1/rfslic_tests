import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {LicStatus} from "../../page-objects/helpers/enums/licstatus.js";
import * as Process from "process";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Заявки", () => {
    test(`Дата запуска : ${InputData.currentDate}, Версия модуля: ${Process.env.APP_VERSION}`,
        async ({requests}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${InputData.testAnnotationDate}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`}
        );

        await test.step(
            "Создание заявки в статусе Черновик",
            async () => await requests.createDraft()
        );
        await test.step(
            "Подача заявки",
            async () => await requests.publishLic()
        );
        await test.step(
            "Добавление экспертов и сотрудников для групп критериев",
            async () => await requests.addExperts()
        );
        await test.step(
            "Заполнение документов критериев, сотрудников и офи",
            async () => await requests.addDocInfo()
        );
        await test.step(
            "Добавление комментариев и решений по документам экспертов групп критериев",
            async () => await requests.addExpertInfo()
        );
        await test.step(
            "Добавление решения по заявки",
            async () => await requests.addConclusions()
        );
        await test.step(
            "Проставление статуса 'Ожидает решения комиссии'",
            async () => await requests.editLicStatus(LicStatus.waitForCommission)
        );
        if (Process.env.BRANCH == "prod")
            await test.step(
                "Вынесение решения комиссии по заявке",
                async () => await requests.addCommissionDecision()
            );
    })
})