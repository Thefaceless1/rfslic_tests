import {test} from "../../page-objects/helpers/fixtures/fixtures.js";
import {LicStatus} from "../../page-objects/helpers/enums/licstatus.js";
import * as Process from "process";

test.describe("Work with requests", () => {
    test("Work with requests scenario",async ({requests}) => {
        await test.step("Creating a request in 'Draft' status",async () => await requests.createDraft());
        await test.step("Publication of the request",async () => await requests.publishLic());
        await test.step("Filling in experts and club members for criteria groups",async () => await requests.addExperts());
        await test.step("Filling criteria documents, club workers and ofi",async () => await requests.addDocInfo());
        await test.step("Adding expert information (comments, statuses, reports)",async () => await requests.addExpertInfo());
        await test.step("Adding conclusions",async () => await requests.addConclusions());
        await test.step("Changing the status of request to Awaiting the decision of the commission",async () => {
            await requests.editLicStatus(LicStatus.waitForCommission)
        });
        if (Process.env.BRANCH == "prod") await test.step("Adding request decision",async () => await requests.addCommissionDecision());
    })
})