import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {LicStatus} from "../../page-objects/helpers/enums/licstatus.js";
import * as Process from "process";

test.describe("Заявки", () => {
    test("Сценарий проверки: " +
        "1. Создание заявки в статусе Черновик " +
        "2. Подача заявки " +
        "3. Добавление экспертов и сотрудников для групп критериев " +
        "4. Заполнение документов критериев, сотрудников и офи " +
        "5. Добавление комментариев и решений по документам экспертов групп критериев " +
        "6. Добавление решения по заявки " +
        "7. Проставление статуса 'Ожидает решения комиссии' " +
        "8. Вынесение решения комиссии по заявке",async ({requests}) => {
        await test.step("Создание заявки в статусе Черновик",async () => await requests.createDraft());
        await test.step("Подача заявки",async () => await requests.publishLic());
        await test.step("Добавление экспертов и сотрудников для групп критериев",async () => await requests.addExperts());
        await test.step("Заполнение документов критериев, сотрудников и офи",async () => await requests.addDocInfo());
        await test.step("Добавление комментариев и решений по документам экспертов групп критериев",async () => await requests.addExpertInfo());
        await test.step("Добавление решения по заявки",async () => await requests.addConclusions());
        await test.step("Changing the status of request to Awaiting the decision of the commission",async () => {
            await requests.editLicStatus(LicStatus.waitForCommission)
        });
        if (Process.env.BRANCH == "prod") await test.step("Вынесение решения комиссии по заявке",async () => await requests.addCommissionDecision());
    })
})