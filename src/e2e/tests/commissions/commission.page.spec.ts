import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Commissions", () => {
    test("Commission scenario", async ({commission}) => {
        await test.step("Creating a meeting", async () => await commission.createMeeting());
        await test.step("Adding requests to a meeting", async () => await commission.addRequestsToMeeting());
        await test.step("Adding decisions on requests", async () => await commission.addRequestDecision());
        await test.step("Adding a report and protocol for the commission", async () => await commission.addReport());
    })
})