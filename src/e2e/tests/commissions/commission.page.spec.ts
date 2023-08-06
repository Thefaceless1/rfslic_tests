/*
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {InputData} from "../../page-objects/helpers/input-data.js";

test.describe("Заседания комиссий", () => {
    test(`Дата и время запуска: ${InputData.currentDate}; Версия модуля: ${Process.env.APP_VERSION}`,
        async ({commission}) => {
        test.info().annotations.push
        (
            {type: "Дата и время запуска",description: `${new Date().toLocaleString()}`},
            {type: "Версия модуля",description: `${Process.env.APP_VERSION}`}
        );
        await test.step("Создание заседания", async () => await commission.createMeeting());
        await test.step("Добавление заявок в заседание", async () => await commission.addRequestsToMeeting());
        await test.step("Вынесение решений по заявкам", async () => await commission.addRequestDecision());
        await test.step("Добавление отчета и протокола", async () => await commission.addReport());
    })
})
*/
