import {test, expect, describe} from "@jest/globals";
import superagent from "superagent";
import {Api} from "../helpers/api";
import {Admin} from "../helpers/admin";
import {Hooks} from "../helpers/hooks/hooks";

describe("Administration",() => {
    const api = new Api();
    const admin = new Admin();
    Hooks.beforeAdmin(admin);
    Hooks.afterEachAdmin(api, admin);
    test("Adding a user",async () => {
        const response = await superagent.put(api.basicUrl + api.admin.addUser).
        query({roleId : admin.rolesId[0],userId : admin.clubWorkersId[0]}).
        set("cookie", `${admin.cookie}`);
        admin.user.push(response.body.data);
        expect(admin.user[0].roleId).toBe(admin.rolesId[0]);
        expect(admin.user[0].id).toBe(admin.clubWorkersId[0]);
    })
    test("Changing a user's role",async () => {
        const response = await superagent.put(api.basicUrl + api.admin.changeUserRole).
        query({roleId : admin.rolesId[1]}).
        set("cookie", `${admin.cookie}`);
        admin.fillUser(0,response);
        expect(admin.user[0].roleId).toBe(admin.rolesId[1]);
    })
    test("User change", async () => {
        const response = await superagent.put(api.basicUrl + api.admin.changeUser).
        send(admin.changeUser()).
        set("cookie", `${admin.cookie}`);
        admin.fillUser(0,response);
        expect(admin.user[0].groups.length).toBe(admin.criteriaGrpId.length);
        if(admin.roles[1].isClub) expect(admin.user[0].clubs.length).toBe(admin.orgId.length);
    })
    test("Adding a role", async () => {
        const response = await superagent.put(api.basicUrl + api.admin.addRole).
        send(admin.addRole()).
        set("cookie", `${admin.cookie}`);
        admin.fillRole(0,response);
        expect(admin.role[0].rights.length).toBe(admin.rightsId.length);
        expect(admin.role[0].id).toBeTruthy();
    })
    test("Removing a role", async () => {
        const response = await superagent.delete(api.basicUrl + api.admin.deleteRole).
        set("cookie", `${admin.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
})