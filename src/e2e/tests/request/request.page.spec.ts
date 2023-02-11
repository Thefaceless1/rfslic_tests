import {expect} from "@playwright/test";
import {Notifications} from "../../page-objects/helpers/enums/notifications.js";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Work with requests", () => {
    test("Filling in experts and club members for criteria groups",async ({requests}) => {
        await requests.addExperts();
        await expect(requests.notifyByEnum(Notifications.changedClubWorkers).last()).toBeVisible();
    })
    test("Filling criteria documents", async ({requests}) => {
        await requests.addExperts();
        await requests.addCritDocs();
        await expect(requests.notifyByEnum(Notifications.saved).last() || requests.notifyByEnum(Notifications.addedDocs).last()).toBeVisible();
    })
    test("Adding expert information (comments, statuses, reports)",async ({requests}) => {
        await requests.addExperts();
        await requests.addCritDocs();
        await requests.addExpertInfo();
        await expect(requests.notifyByEnum(Notifications.madeDecision).last()).toBeVisible();
        await expect(requests.notifyByEnum(Notifications.reportCreated).last()).toBeVisible();
    })
    test("Making a decision on a request", async ({requests}) => {
        await requests.addExperts();
        await requests.addCritDocs();
        await requests.addExpertInfo();
        await requests.chooseLicStatus();
        await expect(requests.notifyByEnum(Notifications.licStatusSelected).last()).toBeVisible();
    })
})