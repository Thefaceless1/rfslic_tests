import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Filing an request", () => {
    test("Filing an request scenario",async ({newRequest},testInfo) => {
        await test.step("Creating a request in 'Draft' status",async () => await newRequest.createDraft());
        await test.step("Publication of the request",async () => await newRequest.publishLic());
        expect(testInfo.status).toBe("passed");
    })
})