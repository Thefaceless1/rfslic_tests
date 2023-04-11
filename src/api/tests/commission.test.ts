import {describe} from "@jest/globals";
import superagent from "superagent";
import {Commission} from "../helpers/commission";
import {TLicenses} from "../helpers/types/commission.type";
import {Api} from "../helpers/api";
import {Hooks} from "../helpers/hooks/hooks";
import {TestData} from "../helpers/test-data";
import {ErrorMessages} from "../helpers/enums/error-messages";

describe("Commissions", () => {
    const commission  = new Commission();
    const api = new Api();
    Hooks.beforeCommission(commission);
    Hooks.afterEachCommission(api,commission);
    test("Creation of the commission",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.createCommission).
        send(commission.createCommission()).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        commission.fillCommission(0,response);
        expect(commission.commission[0].id).toBeTruthy();
        expect(commission.commission[0].typeId).toBe(commission.commissionTypesId[0]);
        expect(commission.commission[0].workDate).toBe(TestData.currentDate);
    })
    test("Adding requests for commission",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.addRequests).
        send(await commission.addRequests()).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
        await commission.refreshCommission(api);
    })
    test("Removing a request from the commission",async () => {
        const response = await superagent.delete(api.basicUrl + api.commissions.deleteRequest).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
        await commission.refreshCommission(api);
    })
    test("Making a decision on the requests of the commission",async () => {
        for(const license of commission.commission[0].licenses!) {
            const response = await superagent.put(api.basicUrl + api.commissions.changeCommissionRequest(commission,license.licId)).
            send(commission.addDecision()).
            set("cookie", `${commission.cookie}`).
            set("x-csrf-token",commission.x_csrf_token);
            const currentLicense : TLicenses = response.body.data.licenses.find((value : TLicenses) => value.licId == license.licId);
            expect(currentLicense.comment).toBe(TestData.commentValue);
            expect(currentLicense.endState).not.toBeNull();
            expect(currentLicense.endStateId).not.toBeNull();
        }
    })
    test("Error when deleting request with a decision",async () => {
        await superagent.delete(api.basicUrl + api.commissions.deleteRequest).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token).catch(reason => {
            expect(reason.status).toBe(400);
            expect(JSON.parse(reason.response.text).error).toBe(ErrorMessages.removingRequestError);
        });
    })
    test("Adding members for a commission type",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.commissionTypeMembers).
        send(commission.addMembers()).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding members for a commission", async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.commissionMembers).
        send(commission.addMembers()).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding protocol for a commission",async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.addProtocol).
        send(commission.files[0]).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        commission.fillCommission(0,response);
        expect(commission.commission[0].protocolName).toBe(commission.files[0].name);
        expect(commission.commission[0].protocolStorageId).toBe(commission.files[0].storageId);
    })
    test("Adding report by license type for a commission", async () => {
        const response = await superagent.post(api.basicUrl + api.commissions.addReportByType).
        send(commission.addReport("byType")).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding report by club for a commission", async () => {
        const response = await superagent.post(api.basicUrl + api.commissions.addReportByClub).
        send(commission.addReport("byClub")).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Adding text for a license type", async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.addLicenseText).
        send(commission.addLicTypeText()).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("License formation", async () => {
        const response = await superagent.put(api.basicUrl + api.commissions.formLicense).
        send(await commission.formLicense()).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        expect(response.body.data.fileName).not.toBeNull();
        expect(response.body.data.storageId).not.toBeNull();
    })
    test("Removing commission file",async () => {
        await commission.refreshCommission(api);
        const fileId : number  = commission.commission[0].files![0].id!
        const response = await superagent.delete(api.basicUrl + api.commissions.deleteFile + fileId).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Error when deleting commission", async () => {
        await superagent.delete(api.basicUrl + api.commissions.getCommission).
        set("cookie", `${commission.cookie}`).
        set("x-csrf-token",commission.x_csrf_token).catch(reason => {
            expect(reason.status).toBe(400);
            expect(JSON.parse(reason.response.text).error).toBe(ErrorMessages.removingCommissionError);
        });
    })
})