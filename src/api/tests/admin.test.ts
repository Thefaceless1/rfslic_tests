import {test, expect, describe} from "@jest/globals";
import superagent from "superagent";
import {Catalogs} from "../class/catalogs";
import {Api} from "../helpers/api";
import {Admin} from "../class/admin";
import {Hooks} from "../helpers/hooks/hooks";

describe("Администрирование",() => {
    const catalogs = new Catalogs();
    const api = new Api();
    const admin = new Admin();
    Hooks.beforeAdmin(catalogs);
    Hooks.afterAdmin(catalogs);
    test("Добавление пользователя",async () => {
        const response = await superagent.put(api.basicUrl + api.admin.addUser).
        query({roleId : catalogs.rolesId[0],userId : catalogs.clubWorkersId[0]});
        admin.user.push(response.body.data);
    })
})