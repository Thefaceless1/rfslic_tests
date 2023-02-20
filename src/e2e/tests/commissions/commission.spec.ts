import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Commissions", () => {
    /**
     * 1. Creating a meeting
     * 2. Adding requests to a meeting
     * 3. Adding requests to the meeting
     * 4. Adding decisions on requests
     * 5. Adding a report and protocol for the commission
     * 6. Removing the meeting
     */
    test.only("Commission scenario", async ({commission},testInfo) => {
        await commission.createMeeting();
        await commission.addRequestsToMeeting();
        await commission.addRequestDecision();
        await commission.addReport();
        await commission.deleteMeeting();
        expect(testInfo.status).toBe("passed");
    })
})