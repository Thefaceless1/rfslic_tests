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
        admin.fillEntity("user", 0,response);
        expect(admin.user[0].roleId).toBe(admin.rolesId[1]);
    })
    test("User change", async () => {
        const response = await superagent.put(api.basicUrl + api.admin.changeUser).
        send(admin.changeUser()).
        set("cookie", `${admin.cookie}`);
        admin.fillEntity("user", 0,response);
        expect(admin.user[0].groups.length).toBe(admin.criteriaGrpId.length);
        if(admin.roles[1].isClub) expect(admin.user[0].clubs.length).toBe(admin.orgId.length);
    })
    test("Adding a role", async () => {
        const response = await superagent.put(api.basicUrl + api.admin.addRole).
        send(admin.addRole()).
        set("cookie", `${admin.cookie}`);
        admin.fillEntity("role", 0,response);
        expect(admin.role[0].rights.length).toBe(admin.rightsId.length);
        expect(admin.role[0].id).toBeTruthy();
    })
    test("Removing a role", async () => {
        const response = await superagent.delete(api.basicUrl + api.admin.deleteRole).
        set("cookie", `${admin.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding a criteria group", async () => {
        const response = await superagent.put(api.basicUrl + api.admin.changeCritGroup).
        send(admin.addCriteriaGroup()).
        set("cookie", `${admin.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).toBeTruthy();
        admin.fillEntity("criteriaGroups", 0,response);
    })
    test("Changing a criteria group", async () => {
        const response = await superagent.put(api.basicUrl + api.admin.changeCritGroup).
        send(admin.changeCriteriaGroup()).
        set("cookie", `${admin.cookie}`)
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.name).toBe(admin.critGroups[0].name);
        expect(response.body.data.active).toBe(admin.critGroups[0].active);
    })
    test("Removing a criteria group",async () => {
        const response = await superagent.delete(api.basicUrl + api.admin.deleteCriteriaGroup).
        set("cookie", `${admin.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding a criteria rank",async () => {
        const response = await superagent.put(api.basicUrl + api.admin.changeCritRank).
        send(admin.addCriteriaRank()).
        set("cookie", `${admin.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).toBeTruthy();
        admin.fillEntity("criteriaRanks",0,response);
    })
    test("Changing a criteria rank",async () => {
        const response = await superagent.put(api.basicUrl + api.admin.changeCritRank).
        send(admin.changeCriteriaRank()).
        set("cookie", `${admin.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.description).toBe(admin.critRanks[0].description);
        expect(response.body.data.code).toBe(admin.critRanks[0].code);
    })
    test("Removing a criteria rank",async () => {
        const response = await superagent.delete(api.basicUrl + api.admin.deleteCriteriaRank).
        set("cookie", `${admin.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
})