import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Groups classifier",() => {
    test("Groups classifier scenario",async ({groupClassifier},testInfo) => {
        await test.step("Creating a group",async () => await groupClassifier.addGroup());
        await test.step("Changing a group",async () => await groupClassifier.changeGroup());
        await test.step("Removing a group",async () => await groupClassifier.deleteGroup());
        expect(testInfo.status).toBe("passed");
    })
})