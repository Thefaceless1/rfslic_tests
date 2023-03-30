import {test} from "../../page-objects/helpers/fixtures/fixtures.js";

test.describe("Users",() => {
    test("Users scenario",async ({users}) => {
        await test.step("Adding a new user",async () => await users.addUser());
        await test.step("Editing user rights",async () => await users.changeRoleRights());
        await test.step("Changing the role assigned to a user",async () => await users.changeUserRole());
        await test.step("Editing user criteria groups",async () => await users.changeUserGrpCrit());
    })
})