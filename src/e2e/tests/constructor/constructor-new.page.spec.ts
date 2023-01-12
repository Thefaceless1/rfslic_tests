import {expect, test} from "@playwright/test";
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
        await expect(constructor.notifyByEnum(Notifications.prolicenseDeleted)).toBeVisible();
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
        await expect(constructor.notifyByEnum(Notifications.createdCritGrp).last()).toBeVisible();
    })
    test("Создание критериев",async ({page}) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.createGrpCrit();
        await constructor.createCriteria();
        await expect(constructor.notifyByEnum(Notifications.createdCriteria).last()).toBeVisible();
    })
})