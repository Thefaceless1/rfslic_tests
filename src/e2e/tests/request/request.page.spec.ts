import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {LicStatus} from "../../page-objects/helpers/enums/licstatus.js";

test.describe("Work with requests", () => {
    /**
     * 1. Filling in experts and club members for criteria groups
     * 2. Filling criteria documents, club workers and ofi
     * 3. Adding expert information (comments, statuses, reports)
     * 4. Making a decision on a request
     */
    test("Work with requests scenario",async ({requests},testInfo) => {
        await requests.addExperts();
        await requests.addCritInfo();
        await requests.addExpertInfo();
        await requests.chooseLicStatus(LicStatus.issued);
        expect(testInfo.status).toBe("passed");
    })
})