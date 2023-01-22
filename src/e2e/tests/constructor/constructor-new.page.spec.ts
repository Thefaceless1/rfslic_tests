import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Пролицензия", () => {
    test("Создание пролицензии",async ({constructor}) => {
        await expect(constructor.notifyByEnum(Notifications.prolicenseCreated)).toBeVisible();
    })
    test("Изменение общей информации пролицензии", async ({constructor}) => {
        await constructor.changeBasicInfo();
        await expect(constructor.notifyByEnum(Notifications.prolicenseChanged)).toBeVisible();
    })
    test("Создание пролицензии по образцу",async ({constructor}) => {
        await constructor.cloneProlicense();
        await expect(constructor.notifyByEnum(Notifications.prolicenseCopied)).toBeVisible();
    })
    test("Публикация пролицензии",async ({constructor}) => {
        await constructor.publishProlicense();
        await expect(constructor.notifyByEnum(Notifications.prolicensePublished)).toBeVisible();
    })
    test("Снятие с публикации пролицензии",async ({constructor}) => {
        await constructor.unpublishProlicense();
        await expect(constructor.notifyByEnum(Notifications.prolicenseUnpublished)).toBeVisible();
    })
    test("Создание групп критериев",async ({constructor}) => {
        await constructor.createGrpCrit();
        await expect(constructor.notifyByEnum(Notifications.createdCritGrp).last()).toBeVisible();
    })
    test("Создание критериев",async ({constructor}) => {
        await constructor.createGrpCrit();
        await constructor.createCriteria();
        await expect(constructor.notifyByEnum(Notifications.createdCriteria).last()).toBeVisible();
    })
})