import {describe} from "@jest/globals";
import {Commission} from "../helpers/commission";
import {Hooks} from "../helpers/hooks/hooks";
import {TestData} from "../helpers/test-data";
import {ErrorMessages} from "../helpers/enums/error-messages";
import {LicStatus} from "../helpers/enums/license-status";
import {InstanceApi} from "../helpers/api/instance.api";
import {FilesInterface} from "../helpers/types/catalogs.interface";

describe("Commissions",  () => {
    const commission  = new Commission();
    Hooks.beforeCommission(commission);

    test("Creation of the commission",async () => {
        await commission.createCommission();
        expect(commission.commission.id).toBeTruthy();
        expect(commission.commission.workDate).toBe(TestData.currentDate);
    })
    test("Adding requests for commission",async () => {
        const addedLicCount: number = await commission.addRequests();
        expect(commission.commission.licenses?.length).toBe(addedLicCount);
    })
    test("Removing a request from a commission",async () => {
        const deletedRequestId: number = await commission.deleteRequest();
        expect(commission.commission.licenses?.find(lic => lic.licId == deletedRequestId)).toBeFalsy();
    })
    test("Making a decision on requests of a commission",async () => {
        await commission.addDecision();
        for(const license of commission.commission.licenses!) {
            expect(license.comment).toBe(TestData.commentValue);
            expect(license.endState).not.toBeNull();
            expect(license.endStateId).not.toBeNull();
            if(license.endState == LicStatus.issuedWithConditions) {
                expect(license.controlDate).toBe(TestData.futureDate);
            }
        }
    })
    test("Error when deleting request with a decision",async () => {
        const errorMessage = await commission.deleteRequestWithError();
        expect(errorMessage).toBe(ErrorMessages.removingRequestError);
    })
    test("Adding members for a commission type",async () => {
        const responseStatus: string = await commission.addCommissionTypeMembers();
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("Adding members for a commission", async () => {
        const responseStatus: string = await commission.addCommissionMembers();
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("Adding protocol for a commission",async () => {
        const addedFileData: FilesInterface = await commission.addProtocol();
        expect(commission.commission.protocolName).toBe(addedFileData.name);
        expect(commission.commission.protocolStorageId).toBe(addedFileData.storageId);
    })
    test("Adding report by license type for a commission", async () => {
        const responseStatus: string = await commission.addReport("byType");
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("Adding report by club for a commission", async () => {
        const responseStatus: string = await commission.addReport("byClub");
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("Adding text for a license type", async () => {
        const responseStatus: string = await commission.addLicTypeText();
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("License formation", async () => {
        const responseStatus: string = await commission.formLicense();
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("Removing commission file",async () => {
        const responseStatus: string = await commission.deleteCommissionFile()
        expect(responseStatus).toBe(InstanceApi.successResponseStatus);
    })
    test("Error when deleting commission", async () => {
        const errorMessage: string = await commission.deleteCommissionWithError();
        expect(errorMessage).toBe(ErrorMessages.removingCommissionError);
    })
})