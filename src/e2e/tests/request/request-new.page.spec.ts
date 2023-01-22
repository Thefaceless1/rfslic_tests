import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Подача заявки", () => {
    test("Создание заявки в статусе 'Черновик' ",async ({newRequest}) => {
        await newRequest.createDraft();
        await expect(newRequest.requestTitle).toBeVisible();
    })
    test("Подача заявки", async ({newRequest}) => {
        await newRequest.createDraft();
        await newRequest.publishLic();
        await expect(newRequest.notifyByEnum(Notifications.createdRequest)).toBeVisible();
    })
})