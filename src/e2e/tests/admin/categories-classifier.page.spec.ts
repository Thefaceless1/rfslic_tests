import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Categories classifier",() => {
    /**
     * 1. Creating a category
     * 2. Changing a category
     * 3. Removing a category
     */
    test("Categories classifier scenario",async ({categoriesClassifier},testInfo) => {
        await categoriesClassifier.addCategory();
        await categoriesClassifier.changeCategory();
        await categoriesClassifier.deleteCategory();
        expect(testInfo.status).toBe("passed");
    })
})