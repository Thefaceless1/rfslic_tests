import {test, expect, describe} from "@jest/globals";
import {Admin} from "../helpers/admin";
import {Hooks} from "../helpers/hooks/hooks";
import {InstanceApi} from "../helpers/api/instance.api";
import {CritRankInterface} from "../helpers/types/admin.interface";

describe("Administration",() => {
    const admin = new Admin();
    Hooks.beforeAdmin(admin);

    test("Adding a user",async () => {
        await admin.addUser();
        expect(admin.user[0].roleId).toBe(admin.selectedUserRoleId);
        expect(admin.user[0].id).toBe(admin.selectedUserId);
    })
    test("Changing a user's role",async () => {
        await admin.changeUserRole();
        expect(admin.user[0].roleId).toBe(admin.selectedUserRoleId);
    })
    test("Change user parameters", async () => {
        await admin.changeUser();
        expect(admin.user[0].groups.length).toBe(admin.criteriaGrpId.length);
        const currentUserRoleData = admin.roles.find(role => role.id == admin.selectedUserRoleId);
        if(currentUserRoleData && currentUserRoleData.isClub) expect(admin.user[0].clubs.length).toBe(admin.orgId.length);
    })
    test("Adding a role", async () => {
        await admin.addRole();
        expect(admin.role[0].rights.length).toBe(admin.rightsId.length);
        expect(admin.role[0].id).toBeTruthy();
    })
    test("Removing a role", async () => {
        const responseStatus: string = await admin.deleteRole();
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("Adding a criteria group", async () => {
        await admin.addCriteriaGroup();
        expect(admin.critGroups[0].id).not.toBeNull();
        expect(admin.critGroups[0].active).toBeTruthy();
    })
    test("Changing a criteria group", async () => {
        await admin.changeCriteriaGroup();
        expect(admin.critGroups[0].active).toBeFalsy();
    })
    test("Removing a criteria group",async () => {
        const responseStatus: string = await admin.deleteCriteriaGroup()
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("Adding a criteria rank",async () => {
        await admin.addCriteriaRank();
        expect(admin.critRanks[0].id).not.toBeNull();
    })
    test("Changing a criteria rank",async () => {
        const oldCriteriaRankData: CritRankInterface = await admin.changeCriteriaRank();
        expect(oldCriteriaRankData.code).not.toBe(admin.critRanks[0].code);
        expect(oldCriteriaRankData.description).not.toBe(admin.critRanks[0].description);
    })
    test("Removing a criteria rank",async () => {
        const responseStatus: string = await admin.deleteCriteriaRank();
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
})