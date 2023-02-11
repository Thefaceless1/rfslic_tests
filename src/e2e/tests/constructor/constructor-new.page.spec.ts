import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Prolicense", () => {
    test.beforeAll(async ({setUser}) => {
        await setUser.createUser();
    })
    test("Create a prolicense",async ({constructor}) => {
        await expect(constructor.notifyByEnum(Notifications.prolicenseCreated)).toBeVisible();
    })
    test("Removing a prolicense",async ({constructor}) => {
        await constructor.deleteProlicense();
        await expect(constructor.notifyByEnum(Notifications.prolicenseCreated)).toBeVisible();
    })
    test("Changing the general information of a prolicense", async ({constructor}) => {
        await constructor.changeBasicInfo();
        await expect(constructor.notifyByEnum(Notifications.prolicenseChanged)).toBeVisible();
    })
    test("Copying a prolicense",async ({constructor}) => {
        await constructor.cloneProlicense();
        await expect(constructor.notifyByEnum(Notifications.prolicenseCopied)).toBeVisible();
    })
    test("Publication of a prolicense",async ({constructor}) => {
        await constructor.publishProlicense();
        await expect(constructor.notifyByEnum(Notifications.prolicensePublished)).toBeVisible();
    })
    test("Creating criteria groups",async ({constructor}) => {
        await constructor.createGrpCrit();
        await expect(constructor.notifyByEnum(Notifications.createdCritGrp).last()).toBeVisible();
    })
    test("Creation of criterias",async ({constructor}) => {
        await constructor.createGrpCrit();
        await constructor.createCriteria();
        await expect(constructor.notifyByEnum(Notifications.createdCriteria).last()).toBeVisible();
    })
})