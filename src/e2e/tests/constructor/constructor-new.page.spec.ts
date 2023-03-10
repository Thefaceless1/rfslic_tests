import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Prolicense", () => {
    test("Prolicense scenario",async ({constructor},testInfo) => {
        await test.step("Creation a prolicense",async () => await constructor.createProlicense());
        await test.step("Changing the general information of a prolicense",async () => await constructor.changeBasicInfo());
        await test.step("Creation criteria groups",async () => await constructor.createGrpCrit());
        await test.step("Creation criterias",async () => await constructor.createCriteria());
        await test.step("Clone a prolicense",async () => await constructor.cloneProlicense());
        await test.step("Delete a prolicense",async () => await constructor.deleteProlicense());
        await test.step("Publication a prolicense",async () => await constructor.publishProlicense("prolic"));
        await test.step("Unpublish a prolicense",async () => await constructor.unpublishProlicense());
        expect(testInfo.status).toBe("passed");
    })
})