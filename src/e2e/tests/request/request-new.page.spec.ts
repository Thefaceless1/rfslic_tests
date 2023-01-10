import {expect, test} from "@playwright/test";
import {RequestNewPage} from "../../page-objects/pages/request-new.page.js";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";

test.describe("Подача заявки", () => {
    test.beforeEach(async ({page}) => {
        const newRequest = new RequestNewPage(page);
        await newRequest.createTestProlicense();
        await newRequest.goto(newRequest.newRequestUrl);
        await newRequest.filterByProlicName();
    })
    test("Создание заявки в статусе 'Черновик' ",async ({page}) => {
        const newRequest = new RequestNewPage(page);
        await newRequest.createDraft();
        await expect(newRequest.notifyByEnum(Notifications.draftCreated)).toBeVisible();
    })
    test("Подача заявки", async ({page}) => {
        const newRequest = new RequestNewPage(page);
        await newRequest.createDraft();
        await newRequest.publishLic();
        await expect(newRequest.notifyByEnum(Notifications.createdRequest)).toBeVisible();
    })
})