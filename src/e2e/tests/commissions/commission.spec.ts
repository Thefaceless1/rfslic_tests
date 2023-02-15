import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Commissions", () => {
    test.beforeAll(async ({setUser}) => {
        await setUser.createUser();
    })
    test("Creating a commission", async ({commission}) => {
        await expect(commission.notifyByEnum(Notifications.commissionCreated)).toBeVisible();
    })
    test("Adding requests to a commission", async ({commission}) => {
        await commission.addRequestsToCommission();
        await expect(commission.notifyByEnum(Notifications.requestsAdded)).toBeVisible();
    })
})