import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Groups classifier",() => {
    /**
     * 1. Creating a group
     * 2. Changing a group
     * 3. Removing a group
     */
    test("Groups classifier scenario",async ({groupClassifier},testInfo) => {
        await groupClassifier.addGroup();
        await groupClassifier.changeGroup();
        await groupClassifier.deleteGroup();
        expect(testInfo.status).toBe("passed");
    })
})