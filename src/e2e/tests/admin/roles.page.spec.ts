import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Roles",() => {
    test("Roles scenario",async ({roles}) => {
        await test.step("Adding a role",async () => await roles.addRole());
        await test.step("Changing role rights",async () => await roles.changeRoleRights("roles"));
        await test.step("Removing a role",async () => await roles.deleteRole());
    })
})