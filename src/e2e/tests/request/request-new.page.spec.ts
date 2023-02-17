import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Filing an request", () => {
    /**
     * 1. Creating a request in 'Draft' status
     * 2. Publication of the request
     */
    test("Filing an request scenario",async ({newRequest},testInfo) => {
        await newRequest.createDraft();
        await newRequest.publishLic();
        expect(testInfo.status).toBe("passed");
    })
})