import {expect, test} from "@playwright/test";
import {RequestPage} from "../../page-objects/pages/request.page.js";

test.describe("Работа с заявками", () => {
    test.beforeEach(async ({page}) => {
        const request = new RequestPage(page);
        await request.createTestProlicense();
        await request.createTestLic();
        await request.openPublishedLic();
    })
    test.only("Заполнение экспертов и сотрудников клуба для групп критериев",async ({page}) => {
        const request = new RequestPage(page);
        await request.fillExperts();
    })
})