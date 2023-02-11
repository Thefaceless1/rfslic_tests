import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Filing an request", () => {
    test.beforeAll(async ({setUser}) => {
        await setUser.createUser();
    })
    test("Creating a request in 'Draft' status",async ({newRequest}) => {
        await newRequest.createDraft();
        await expect(newRequest.requestTitle).toBeVisible();
    })
    test("Publication of the request", async ({newRequest}) => {
        await newRequest.createDraft();
        await newRequest.publishLic();
        await expect(newRequest.notifyByEnum(Notifications.createdRequest)).toBeVisible();
    })
})