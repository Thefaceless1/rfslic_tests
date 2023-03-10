import {describe} from "@jest/globals";
import superagent from "superagent";
import {Commission, TLicenses} from "../helpers/commission";
import {Api} from "../helpers/api";
import {Hooks} from "../helpers/hooks/hooks";
import {TestData} from "../helpers/test-data";

describe("Commissions", () => {
    const commission  = new Commission();
    const api = new Api();
    Hooks.beforeCommission(commission);
    Hooks.afterEachCommission(api,commission);
    test("Creation of the commission",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.createCommission).
        send(commission.createCommission()).
        set("cookie", `${commission.cookie}`);
        commission.fillCommission(0,response);
        expect(commission.commission[0].id).toBeTruthy();
        expect(commission.commission[0].typeId).toBe(commission.commissionTypesId[0]);
        expect(commission.commission[0].workDate).toBe(TestData.currentDate);
    })
    test("Adding requests for commission",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.addRequests).
        send(await commission.addRequests()).
        set("cookie", `${commission.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Getting commission by Id", async () => {
        const response = await superagent.get(api.basicUrl + api.commissions.getCommission).
        set("cookie", `${commission.cookie}`);
        commission.fillCommission(0,response);
        if(commission.commission[0].licenses)
        expect(commission.commission[0].licenses.length).toBeGreaterThan(0);
    })
    test("Making a decision on the requests of the commission",async () => {
        for(const license of commission.commission[0].licenses!) {
            const response = await superagent.put(api.basicUrl + api.commissions.changeCommissionRequest(commission,license.licId)).
            send(commission.addDecision()).
            set("cookie", `${commission.cookie}`);
            const currentLicense : TLicenses = response.body.data.licenses.find((value : TLicenses) => value.licId == license.licId);
            expect(currentLicense.comment).toBe(TestData.commentValue);
            expect(currentLicense.endState).not.toBeNull();
            expect(currentLicense.endStateId).not.toBeNull();
        }
    })
    test("Removing a request from the commission",async () => {
        const response = await superagent.delete(api.basicUrl + api.commissions.deleteRequest).
        set("cookie", `${commission.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding members for a commission type",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.commissionTypeMembers).
        send(commission.addMembers()).
        set("cookie", `${commission.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding members for a commission", async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.commissionMembers).
        send(commission.addMembers()).
        set("cookie", `${commission.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding protocol for a commission",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.addProtocol).
        send(commission.files[0]).
        set("cookie", `${commission.cookie}`);
        commission.fillCommission(0,response);
        expect(commission.commission[0].protocolName).toBe(commission.files[0].name);
        expect(commission.commission[0].protocolStorageId).toBe(commission.files[0].storageId);
    })
    test("Adding report by license type for a commission", async () => {
        const response = await superagent.post(api.basicUrl + api.commissions.addReportByType).
        send(commission.addReport("byType")).
        set("cookie", `${commission.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding report by club for a commission", async () => {
        const response = await superagent.post(api.basicUrl + api.commissions.addReportByClub).
        send(commission.addReport("byClub")).
        set("cookie", `${commission.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding text for a license type", async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.addLicenseText).
        send(commission.addLicTypeText()).
        set("cookie", `${commission.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("License formation", async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.formLicense).
        send(await commission.formLicense()).
        set("cookie", `${commission.cookie}`);
        expect(response.body.data.fileName).not.toBeNull();
        expect(response.body.data.storageId).not.toBeNull();
    })
    test("Removing commission file",async () => {
        await commission.refreshCommission(api);
        const fileId : number  = commission.commission[0].files![0].id!
        const response = await superagent.delete(api.basicUrl + api.commissions.deleteFile + fileId).
        set("cookie", `${commission.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Removing a commission", async () => {
        const response = await superagent.delete(api.basicUrl + api.commissions.getCommission).
        set("cookie", `${commission.cookie}`);
        expect(response.body.status).toBe("SUCCESS");
    })
})