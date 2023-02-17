import {expect} from "@playwright/test";
import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Prolicense", () => {
    /**
     * 1. Creation a prolicense
     * 2. Changing the general information of a prolicense
     * 3. Creation criteria groups
     * 4. Creation criterias
     * 5. Clone a prolicense
     * 6. Delete a prolicense
     * 7. Publication a prolicense
     * 8. Unpublish a prolicense
     */
    test("Prolicense scenario",async ({constructor}) => {
        await constructor.createProlicense();
        await constructor.changeBasicInfo();
        await constructor.createGrpCrit();
        await constructor.createCriteria();
        await constructor.cloneProlicense();
        await constructor.deleteProlicense();
        await constructor.publishProlicense("prolic");
        await constructor.unpublishProlicense();
    })
})