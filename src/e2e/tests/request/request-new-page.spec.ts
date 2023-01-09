import {test} from "@playwright/test";
import {RequestNewPage} from "../../page-objects/pages/request-new-page.js";

test.describe("Подача заявки", () => {
    test.beforeEach(async ({page}) => {
        const request = new RequestNewPage(page);
        await request.createTestProlicense();
        await request.goto(request.url);
        await request.filterByProlicName();
        await request.page.pause();
    })
    test.only("Создание заявки в статусе 'Черновик' ",async ({page}) => {

    })
})