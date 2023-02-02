import {test, expect, describe} from "@jest/globals";
import superagent from "superagent";
import {Api} from "../helpers/api";
import {Admin} from "../class/admin";
import {Hooks} from "../helpers/hooks/hooks";

describe("Administration",() => {
    const api = new Api();
    const admin = new Admin();
    Hooks.beforeAdmin(admin);
    test("Add user",async () => {
        const response = await superagent.put(api.basicUrl + api.admin.addUser).
        query({roleId : admin.catalogs.rolesId[0],userId : admin.catalogs.clubWorkersId[0]});
        admin.user.push(response.body.data);
        api.fillAdminApi(admin.user[0].id);
        expect(admin.user[0].roleId).toBe(admin.catalogs.rolesId[0]);
        expect(admin.user[0].id).toBe(admin.catalogs.clubWorkersId[0]);
    })
    test("Change user role",async () => {
        const response = await superagent.put(api.basicUrl + api.admin.changeUserRole).
        query({roleId : admin.catalogs.rolesId[1]});
        admin.user[0] = response.body.data;
        expect(admin.user[0].roleId).toBe(admin.catalogs.rolesId[1]);
    })
    test("Change user", async () => {
        const response = await superagent.put(api.basicUrl + api.admin.changeUser).
        send(admin.changeUser());
        admin.user[0] = response.body.data;
        expect(admin.user[0].groups.length).toBe(admin.catalogs.criteriaGrpId.length);
        if(admin.catalogs.roles[1].isClub) expect(admin.user[0].clubs.length).toBe(admin.catalogs.orgId.length);
    })
    test("Add role", async () => {
        const response = await superagent.put(api.basicUrl + api.admin.addRole).
        send(admin.addRole());
        admin.role[0] = response.body.data;
        expect(admin.role[0].rights.length).toBe(admin.catalogs.rightsId.length);
        expect(admin.role[0].id).toBeTruthy();
    })
})