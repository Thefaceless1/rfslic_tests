import {test,expect} from "@playwright/test";
import {ConstructorNewPage} from "../../page-objects/pages/constructor-new.page.js";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";

test.describe("Пролицензия", () => {
    test.beforeEach(async ({page}) => {
      const constructor = new ConstructorNewPage(page);
      await constructor.goto(constructor.url);
      await constructor.createProlicense();
    })
    test.afterEach(async ({page}) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.deleteProlicense();
    })
    test("Создание пролицензии",async ({page}) => {
        const constructor = new ConstructorNewPage(page);
        await expect(constructor.notifyByEnum(Notifications.prolicenseCreated)).toBeVisible();
    })
    test("Создание пролицензии по образцу",async ({page}) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.cloneProlicense();
        await expect(constructor.notifyByEnum(Notifications.prolicenseCopied)).toBeVisible();
    })
    test("Публикация пролицензии",async ({page}) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.publishProlicense();
        await expect(constructor.notifyByEnum(Notifications.prolicensePublished)).toBeVisible();
    })
    test("Снятие с публикации пролицензии",async ({page}) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.unpublishProlicense();
        await expect(constructor.notifyByEnum(Notifications.prolicenseUnpublished)).toBeVisible();
    })
    test("Создание групп критериев",async ({page}) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.createGrpCrit();
        await page.pause();
    })
    test("Создание критериев",async ({page}) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.createGrpCrit();
        await constructor.createCriteria();
    })
})