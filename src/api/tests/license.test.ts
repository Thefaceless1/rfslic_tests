import {describe, expect, test} from "@jest/globals";
import superagent from "superagent";
import {TestData} from "../helpers/test-data";
import {License} from "../helpers/license";
import {Api} from "../helpers/api";
import {Hooks} from "../helpers/hooks/hooks";
import {LicStatus} from "../helpers/enums/license-status";
import {DocumentStatus} from "../helpers/enums/document-status";
import {Templates} from "../helpers/types/prolicense.type";

describe("License requests", () => {
    const license = new License();
    const api = new Api();
    Hooks.beforeLicense(license,api);
    test("Creating a request in 'draft' status",async () => {
        const response = await superagent.put(api.basicUrl+api.request.createLicense).
        send(license.createLicense(license.prolicense)).
        set("cookie", `${license.cookie}`);
        expect(response.body.data.proLicId).toBe(license.prolicense[0].id);
        expect(response.body.data.state).toBe(LicStatus.new);
        expect(response.body.data.percent).toBe(0);
        expect(response.body.data.docState).toBe(DocumentStatus.form);
        license.fillLicense(0,response);
        api.request.fillApi(license.license[0]);
        license.license[0].documents.forEach((document, index) => {
            expect(document.state).toBe(DocumentStatus.form);
            expect(document.proDocId).toBe(license.prolicense[0].documents[index].id);
        })
        license.license[0].criteriaGroups.forEach((criteriaGroup) => {
            expect(criteriaGroup.state).toBe(DocumentStatus.form);
            expect(criteriaGroup.percent).toBe(0.0);
            criteriaGroup.criterias.forEach((criteria) => {
                expect(criteria.state).toBe(DocumentStatus.form);
                expect(criteria.percent).toBe(0.0);
                criteria.documents.forEach(document => {
                    expect(document.state).toBe(DocumentStatus.form);
                })
            })
        })
    })
    test("Adding documents and comments on the 'General Information' tab",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addCommentsAndDocuments()).
        set("cookie", `${license.cookie}`);
        license.fillLicense(0,response);
        license.license[0].documents.forEach((document) => {
            expect(document.comment).toBe(TestData.commentValue);
            expect(document.files.length).toBe(license.files.length);
        })
    })
    test("Publish license", async () => {
        const response = await superagent.put(api.basicUrl + api.request.publishLicense).
        send(license.publishLicense()).
        set("cookie", `${license.cookie}`);
        expect(response.body.data.state).toBe(license.licStatusByEnum(LicStatus.checkManager).name);
        license.fillLicense(0,response);
    })
    test("Adding club workers and experts to the criteria group", async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addClubWorkersToCritGrp()).
        set("cookie", `${license.cookie}`);
        license.license[0].criteriaGroups.forEach((criteriaGroup, index) => {
            expect(criteriaGroup.experts).toEqual(response.body.data.criteriaGroups[index].experts);
            expect(criteriaGroup.rfuExpert).toBe(response.body.data.criteriaGroups[index].rfuExpert);
        })
        license.fillLicense(0,response);
    })
    test("Adding participants and OFI for criterias with Participant and OFI types",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addOfiAndUsers()).
        set("cookie", `${license.cookie}`);
        license.fillLicense(0,response);
        const criteriaCount = license.criteriaTypes.length;
        license.license[0].criteriaGroups.forEach(critGrp => {
            expect(critGrp.criterias.length).toBeGreaterThan(criteriaCount);
        })
    })
    test("Adding documents, club workers, OFI, organizations and comments for criteria documents", async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addDataToCritDoc()).
        set("cookie", `${license.cookie}`);
        license.fillLicense(0,response);
        license.license[0].criteriaGroups.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.documents.forEach((document) => {
                    expect(document.comment).toBe(TestData.commentValue);
                    expect(document.files.length).toEqual(license.files.length);
                })
            })
        })
    })
    test("Removing request file",async () => {
        const fileForRemoving : Templates = license.license[0].documents[0].files[0];
        await superagent.delete(api.basicUrl + api.request.deleteReqFile + fileForRemoving.id).
        set("cookie", `${license.cookie}`);
        await license.refreshLicense(api);
        const isHaveFile : boolean = license.license[0].documents[0].files.includes(fileForRemoving);
        expect(isHaveFile).toBeFalsy();
    })
    test("Removing criteria document file",async () => {
        const fileForRemoving : Templates = license.license[0].criteriaGroups[0].criterias[0].documents[0].files[0];
        await superagent.delete(api.basicUrl + api.request.deleteDocFile + fileForRemoving.id).
        set("cookie", `${license.cookie}`);
        await license.refreshLicense(api);
        const isHaveFile : boolean = license.license[0].criteriaGroups[0].criterias[0].documents[0].files.includes(fileForRemoving);
        expect(isHaveFile).toBeFalsy();
    })
    test("Submit all the criteria group documents for review",async () => {
        await superagent.put(api.basicUrl + api.request.checkDocument).
        set("cookie", `${license.cookie}`);
        await license.refreshLicense(api);
        expect(license.license[0].criteriaGroups[0].state).toBe(DocumentStatus.underReview);
    })
    test("Setting statuses and comments for documents",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addStatusToDocuments()).
        set("cookie", `${license.cookie}`);
        license.fillLicense(0,response);
        expect(license.licPercent).toBe(Math.round(license.license[0].percent));
        license.license[0].criteriaGroups.forEach((criteriaGroup) => {
            const grpPercent = criteriaGroup.criterias.reduce((accum,value) =>accum+value.percent,0)/criteriaGroup.criterias.length;
            expect(Math.round(criteriaGroup.percent)).toBe(Math.round(grpPercent));
            if(criteriaGroup.criterias.some(value => value.state == DocumentStatus.form)) {
                expect(criteriaGroup.state).toBe(DocumentStatus.form);
            }
            else if (criteriaGroup.criterias.some(value => value.state == DocumentStatus.declined)) {
                expect(criteriaGroup.state).toBe(DocumentStatus.declined);
            }
            else if (criteriaGroup.criterias.some(value => value.state == DocumentStatus.underReview)) {
                expect(criteriaGroup.state).toBe(DocumentStatus.underReview);
            }
            else if (criteriaGroup.criterias.some(value => value.state == DocumentStatus.acceptedWithCondition)) {
                expect(criteriaGroup.state).toBe(DocumentStatus.acceptedWithCondition);
            }
            else expect(criteriaGroup.state).toBe(DocumentStatus.accepted);
            criteriaGroup.criterias.forEach((criteria) => {
                expect(Math.round(criteria.percent)).toBe(license.criteriaPercent(criteriaGroup, criteria));
                if (license.criteriaDocuments(criteriaGroup,criteria).some(value => value.state == DocumentStatus.form)){
                    expect(criteria.state).toBe(DocumentStatus.form);
                }
                else if (license.criteriaDocuments(criteriaGroup,criteria).some(value => value.state == DocumentStatus.declined)) {
                    expect(criteria.state).toBe(DocumentStatus.declined);
                }
                else if (license.criteriaDocuments(criteriaGroup,criteria).some(value => value.state == DocumentStatus.underReview)) {
                    expect(criteria.state).toBe(DocumentStatus.underReview);
                }
                else if (license.criteriaDocuments(criteriaGroup,criteria).some(value => value.state == DocumentStatus.acceptedWithCondition)) {
                    expect(criteria.state).toBe(DocumentStatus.acceptedWithCondition);
                }
                else expect(criteria.state).toBe(DocumentStatus.accepted);
            })
        })
    })
    test("Creating an expert report", async () => {
        const groupsCount : number = license.criteriaGroups.length;
        for(let i = 0; i < groupsCount; i++) {
            const groupId : number = license.criteriaGroups[i].id;
            const response = await superagent.post(api.basicUrl + api.request.createExpertReport).
            send(license.addExpertReport(groupId)).
            set("cookie", `${license.cookie}`);
            expect(response.body.data.fileName).toBeTruthy();
            expect(response.body.data.storageId).toBeTruthy();
        }
    })
    test("Adding conclusions for a request",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addConclusions()).
        set("cookie", `${license.cookie}`);
        expect(response.body.data.recommendation).toBe(TestData.commentValue);
        expect(response.body.data.conclusion).toBe(TestData.commentValue);
        expect(response.body.data.rplCriterias).toBe(TestData.commentValue);
    })
})