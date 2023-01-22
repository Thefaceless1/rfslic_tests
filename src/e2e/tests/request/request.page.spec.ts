import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Работа с заявками", () => {
    test("Заполнение экспертов и сотрудников клуба для групп критериев",async ({requests}) => {
        await requests.addExperts();
        await expect(requests.notifyByEnum(Notifications.changedClubWorkers).last()).toBeVisible();
    })
    test("Заполнение документов критериев", async ({requests}) => {
        await requests.addExperts();
        await requests.addCritDocs();
        await expect(requests.notifyByEnum(Notifications.saved).last() || requests.notifyByEnum(Notifications.addedDocs).last()).toBeVisible();
    })
    test("Добавление информации эксперта(комментарии, статусы, отчеты)",async ({requests}) => {
        await requests.addExperts();
        await requests.addCritDocs();
        await requests.addExpertInfo();
        await expect(requests.notifyByEnum(Notifications.madeDecision).last()).toBeVisible();
        await expect(requests.notifyByEnum(Notifications.reportCreated).last()).toBeVisible();
    })
    test("Вынесение решения по заявке", async ({requests}) => {
        await requests.addExperts();
        await requests.addCritDocs();
        await requests.addExpertInfo();
        await requests.chooseLicStatus();
        await expect(requests.notifyByEnum(Notifications.licStatusSelected).last()).toBeVisible();
    })
})