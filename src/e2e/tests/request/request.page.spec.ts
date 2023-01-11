import {expect, test} from "@playwright/test";
import {RequestPage} from "../../page-objects/pages/request.page.js";

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
    })
    test("Заполнение документов критериев", async ({page}) => {
        const request = new RequestPage(page);
        await request.addExperts();
        await request.addCritDocs();
    })
    test("Проставление статусов и комментариев для документов",async ({page}) => {
        const request = new RequestPage(page);
        await request.addExperts();
        await request.addCritDocs();
        await request.addStatusAndComment();
    })
})