import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe.only("Work with requests", () => {
    test("Work with requests scenario",async ({requests},testInfo) => {
        await test.step("Filling in experts and club members for criteria groups",async () => await requests.addExperts());
        await test.step("Filling criteria documents, club workers and ofi",async () => await requests.addCritInfo());
        await test.step("Adding expert information (comments, statuses, reports)",async () => await requests.addExpertInfo());
        expect(testInfo.status).toBe("passed");
    })
})