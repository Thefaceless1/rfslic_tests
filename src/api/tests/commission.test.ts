import {describe} from "@jest/globals";
import superagent from "superagent";
import {Commission} from "../class/commission";
import {Api} from "../helpers/api";
import {Hooks} from "../helpers/hooks/hooks";
import {TestData} from "../helpers/test-data";

describe("Commissions", () => {
    const commission = new Commission();
    const api = new Api();
    Hooks.beforeCommission(commission);
    test("Create commission",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.createCommission).
        send(commission.createCommission());
        commission.fillCommission(0,response);
        expect(commission.commission[0].id).toBeTruthy();
        expect(commission.commission[0].typeId).toBe(commission.catalogs.commissionTypesId[0]);
        expect(commission.commission[0].workDate).toBe(TestData.currentDate);
    })
})