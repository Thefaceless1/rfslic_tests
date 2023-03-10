import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Categories classifier",() => {
    test("Categories classifier scenario",async ({categoriesClassifier},testInfo) => {
        await test.step("Creating a category",async () => await categoriesClassifier.addCategory());
        await test.step("Changing a category",async () => await categoriesClassifier.changeCategory());
        await test.step("Removing a category",async () => await categoriesClassifier.deleteCategory());
        expect(testInfo.status).toBe("passed");
    })
})