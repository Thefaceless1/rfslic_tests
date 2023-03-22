import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {LicStatus} from "../../page-objects/helpers/enums/licstatus.js";

test.describe("Work with requests", () => {
    test("Work with requests scenario",async ({requests},testInfo) => {
        await test.step("Filling in experts and club members for criteria groups",async () => await requests.addExperts());
        await test.step("Filling criteria documents, club workers and ofi",async () => await requests.addDocInfo());
        await test.step("Adding expert information (comments, statuses, reports)",async () => await requests.addExpertInfo());
        await test.step("Adding conclusions",async () => await requests.addConclusions());
        await test.step("Change the status of request to Awaiting the decision of the commission",async () => {
            await requests.editLicStatus(LicStatus.waitForCommission)
        });
        expect(testInfo.status).toBe("passed");
    })
})