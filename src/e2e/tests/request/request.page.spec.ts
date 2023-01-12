import {expect, test} from "@playwright/test";
import {RequestPage} from "../../page-objects/pages/request.page.js";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";

test.describe("Работа с заявками", () => {
    test.beforeEach(async ({page}) => {
        const request = new RequestPage(page);
        await request.createTestProlicense();
        await request.createTestLic();
        await request.openPublishedLic();
    })
    test("Заполнение экспертов и сотрудников клуба для групп критериев",async ({page}) => {
        const request = new RequestPage(page);
        await request.addExperts();
        await expect(request.notifyByEnum(Notifications.changedClubWorkers).last()).toBeVisible();
    })
    test("Заполнение документов критериев", async ({page}) => {
        const request = new RequestPage(page);
        await request.addExperts();
        await request.addCritDocs();
        await expect(request.notifyByEnum(Notifications.saved).last() || request.notifyByEnum(Notifications.addedDocs).last()).toBeVisible();
    })
    test("Проставление статусов и комментариев для документов",async ({page}) => {
        const request = new RequestPage(page);
        await request.addExperts();
        await request.addCritDocs();
        await request.addStatusAndComment();
        await expect(request.notifyByEnum(Notifications.madeDecision).last()).toBeVisible();
    })
})