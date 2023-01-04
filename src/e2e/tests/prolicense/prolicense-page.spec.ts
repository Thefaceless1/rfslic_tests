import {test,Page} from "@playwright/test";
import {PlaywrightDevPage} from "../../framework/helpers/playwright-dev-page.js";
import {ProlicensePage} from "../../page-objects/pages/prolicense-page.js";

test.describe("Пролицензия", () => {
    test.beforeEach(async ({page,browser}) => {
      const prolicense = new ProlicensePage(page);
      const playwrightPage = new PlaywrightDevPage(page);
      await playwrightPage.goto(prolicense.url);
    })
    test.afterEach(async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await prolicense.deleteProlicense();
    })
    test("Создание пролицензии",async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await prolicense.createProlicense();
    })
    test("Создание групп критериев",async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await prolicense.createProlicense();
        await prolicense.createGrpCrit();
    })
})