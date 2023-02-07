import {describe} from "@jest/globals";
import superagent from "superagent";
import {Commission, TLicenses} from "../class/commission";
import {Api} from "../helpers/api";
import {Hooks} from "../helpers/hooks/hooks";
import {TestData} from "../helpers/test-data";
import postgres from "postgres";
import value = postgres.toPascal.value;

describe("Commissions", () => {
    const commission = new Commission();
    const api = new Api();
    Hooks.beforeCommission(commission);
    Hooks.afterEachCommission(api,commission);
    test("Creation of the commission",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.createCommission).
        send(commission.createCommission());
        commission.fillCommission(0,response);
        expect(commission.commission[0].id).toBeTruthy();
        expect(commission.commission[0].typeId).toBe(commission.catalogs.commissionTypesId[0]);
        expect(commission.commission[0].workDate).toBe(TestData.currentDate);
    })
    test("Adding requests for commission",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.addRequests).
        send(await commission.addRequests());
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Getting commission by Id", async () => {
        const response = await superagent.get(api.basicUrl + api.commissions.getCommission);
        commission.fillCommission(0,response);
        if(commission.commission[0].licenses)
        expect(commission.commission[0].licenses.length).toBeGreaterThan(0);
    })
    test("Making a decision on the requests of the commission",async () => {
        for(const license of commission.commission[0].licenses!) {
            const response = await superagent.put(api.basicUrl + api.commissions.changeCommissionRequest(commission,license.licId)).
            send(commission.addDecision());
            const currentLicense : TLicenses = response.body.data.licenses.find((value : TLicenses) => value.licId == license.licId);
            expect(currentLicense.comment).toBe(TestData.commentValue);
            expect(currentLicense.endState).not.toBeNull();
            expect(currentLicense.endStateId).not.toBeNull();
        }
    })
    test("Removing a request from the commission",async () => {
        const response = await superagent.delete(api.basicUrl + api.commissions.deleteRequest);
        expect(response.body.status).toBe("SUCCESS");
    })
})