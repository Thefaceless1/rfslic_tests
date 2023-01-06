import {test,Page,expect} from "@playwright/test";
import {ProlicensePage} from "../../page-objects/pages/prolicense-page.js";
import {Notifications} from "../../framework/helpers/enums/notifications.js";

test.describe("Пролицензия", () => {
    test.beforeEach(async ({page}) => {
      const prolicense = new ProlicensePage(page);
      await prolicense.goto(prolicense.url);
      await prolicense.createProlicense();
    })
    test.afterEach(async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await prolicense.deleteProlicense();
    })
    test("Создание пролицензии",async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await expect(prolicense.getNotifyByEnum(Notifications.prolicenseCreated)).toBeVisible();
    })
    test("Создание пролицензии по образцу",async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await prolicense.cloneProlicense();
        await expect(prolicense.getNotifyByEnum(Notifications.prolicenseCopied)).toBeVisible();
    })
    test("Публикация пролицензии",async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await prolicense.publishProlicense();
        await expect(prolicense.getNotifyByEnum(Notifications.prolicensePublished)).toBeVisible();
    })
    test("Снятие с публикации пролицензии",async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await prolicense.unpublishProlicense();
        await expect(prolicense.getNotifyByEnum(Notifications.prolicenseUnpublished)).toBeVisible();
    })
    test("Создание групп критериев",async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await prolicense.createGrpCrit();
    })
    test("Создание критериев",async ({page}) => {
        const prolicense = new ProlicensePage(page);
        await prolicense.createGrpCrit();
        await prolicense.createCriteria();
    })
})