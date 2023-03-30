import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Categories classifier",() => {
    test("Categories classifier scenario",async ({categoriesClassifier}) => {
        await test.step("Creating a category",async () => await categoriesClassifier.addCategory());
        await test.step("Changing a category",async () => await categoriesClassifier.changeCategory());
        await test.step("Removing a category",async () => await categoriesClassifier.deleteCategory());
    })
})