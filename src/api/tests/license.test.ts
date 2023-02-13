import {describe, expect, test} from "@jest/globals";
import superagent from "superagent";
import {TestData} from "../helpers/test-data";
import {Prolicense} from "../helpers/prolicense";
import {License} from "../helpers/license";
import {Criterias} from "../helpers/criterias";
import {Api} from "../helpers/api";
import {Hooks} from "../helpers/hooks/hooks";
import {LicStatus} from "../helpers/enums/license-status";

describe("License requests", () => {
    const license = new License();
    const prolicense = new Prolicense();
    const criterias = new Criterias();
    const api = new Api();
    Hooks.beforeLicense(prolicense,license,criterias,api);
    test("Creating a request in 'draft' status",async () => {
        const response = await superagent.put(api.basicUrl+api.request.createLicense).
        send(license.createLicense(prolicense.prolicense));
        expect(response.body.data.proLicId).toBe(prolicense.prolicense[0].id);
        expect(response.body.data.state).toBe(license.licStatusById(response.body.data.stateId));
        expect(response.body.data.percent).toBe(0);
        expect(response.body.data.docState).toBe(license.docStatusById(response.body.data.docStateId));
        license.fillLicense(0,response);
        api.request.fillApi(license.license[0].id);
        license.license[0].documents.forEach((document, index) => {
            expect(document.state).toBe(license.docStatusById(response.body.data.docStateId));
            expect(document.proDocId).toBe(prolicense.prolicense[0].documents[index].id);
        })
        license.license[0].criteriaGroups.forEach((criteriaGroup, index) => {
            expect(criteriaGroup.groupId).toBe(criterias.criterias[index].id);
            expect(criteriaGroup.state).toBe(license.docStatusById(criteriaGroup.stateId));
            expect(criteriaGroup.percent).toBe(0.0);
            criteriaGroup.criterias.forEach((criteria) => {
                expect(criteria.state).toBe(license.docStatusById(criteria.stateId));
                expect(criteria.percent).toBe(0.0);
                criteria.documents.forEach(document => {
                    expect(document.state).toBe(license.docStatusById(document.stateId));
                })
            })
        })
    })
    test("Adding documents and comments on the 'General Information' tab",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addCommentsAndDocuments());
        license.fillLicense(0,response);
        license.license[0].documents.forEach((document) => {
            expect(document.comment).toBe(TestData.commentValue);
            expect(document.files.length).toBe(TestData.files.length);
        })
    })
    test("Publish license", async () => {
        const response = await superagent.put(api.basicUrl + api.request.publishLicense).
        send(license.publishLicense());
        expect(response.body.data.state).toBe(license.catalogs.licStatusByEnum(LicStatus.checkManager).name);
        license.fillLicense(0,response);
        console.log(license.license[0].name);
    })
    test("Adding club workers and experts to the criteria group", async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addClubWorkersToCritGrp());
        license.license[0].criteriaGroups.forEach((criteriaGroup, index) => {
            expect(criteriaGroup.experts).toEqual(response.body.data.criteriaGroups[index].experts);
            expect(criteriaGroup.rfuExpert).toBe(response.body.data.criteriaGroups[index].rfuExpert);
        })
        license.fillLicense(0,response);
    })
    test("Adding participants and OFI for criterias with Participant and OFI types",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addOfiAndUsers());
        license.fillLicense(0,response);
        const criteriaCount = license.catalogs.criteriaTypes.length;
        license.license[0].criteriaGroups.forEach(critGrp => {
            expect(critGrp.criterias.length).toBeGreaterThan(criteriaCount);
        })
    })
    test("Adding documents, club workers, OFI, organizations and comments for criteria documents", async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addDataToCritDoc());
        license.fillLicense(0,response);
        license.license[0].criteriaGroups.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.documents.forEach((document) => {
                    expect(document.comment).toBe(TestData.commentValue);
                    if(document.docTypeId != 5 && document.docTypeId != 6 && document.docTypeId != 9)
                    expect(document.files.length).toEqual(TestData.files.length);
                    else expect(document.files.length).toEqual(0);

                })
            })
        })
    })
    test("Setting statuses and comments for documents",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addStatusToDocuments());
        license.fillLicense(0,response);
        expect(license.licPercent).toBe(Math.round(license.license[0].percent));
        license.license[0].criteriaGroups.forEach((criteriaGroup) => {
            const grpPercent = criteriaGroup.criterias.reduce((accum,value) =>accum+value.percent,0)/criteriaGroup.criterias.length;
            expect(Math.round(criteriaGroup.percent)).toBe(Math.round(grpPercent));
            if(criteriaGroup.criterias.some(value => value.state == license.docStatusById(1))) {
                expect(criteriaGroup.state).toBe(license.docStatusById(1));
            }
            else if (criteriaGroup.criterias.some(value => value.state == license.docStatusById(5))) {
                expect(criteriaGroup.state).toBe(license.docStatusById(5));
            }
            else if (criteriaGroup.criterias.some(value => value.state == license.docStatusById(2))) {
                expect(criteriaGroup.state).toBe(license.docStatusById(2));
            }
            else if (criteriaGroup.criterias.some(value => value.state == license.docStatusById(4))) {
                expect(criteriaGroup.state).toBe(license.docStatusById(4));
            }
            else expect(criteriaGroup.state).toBe(license.docStatusById(3));
            criteriaGroup.criterias.forEach((criteria) => {
                expect(Math.round(criteria.percent)).toBe(license.criteriaPercent(criteriaGroup, criteria));
                if (license.criteriaDocuments(criteriaGroup,criteria).some(value => value.state == license.docStatusById(1))){
                    expect(criteria.state).toBe(license.docStatusById(1));
                }
                else if (license.criteriaDocuments(criteriaGroup,criteria).some(value => value.state == license.docStatusById(5))) {
                    expect(criteria.state).toBe(license.docStatusById(5));
                }
                else if (license.criteriaDocuments(criteriaGroup,criteria).some(value => value.state == license.docStatusById(2))) {
                    expect(criteria.state).toBe(license.docStatusById(2));
                }
                else if (license.criteriaDocuments(criteriaGroup,criteria).some(value => value.state == license.docStatusById(4))) {
                    expect(criteria.state).toBe(license.docStatusById(4));
                }
                else expect(criteria.state).toBe(license.docStatusById(3));
                criteria.documents.forEach((document) => {
                    expect(document.state).toBe(license.docStatusById(document.stateId));
                })
            })
        })
    })
    test("Creating an expert report", async () => {
        const groupsCount : number = license.catalogs.criteriaGroups.length;
        const firstGrpId : number = license.catalogs.criteriaGroups[0].id;
        for(let i = firstGrpId; i<=groupsCount; i++) {
            const response = await superagent.post(api.basicUrl + api.request.createExpertReport).
            send(license.addExpertReport(i));
            expect(response.body.data.fileName).toBeTruthy();
            expect(response.body.data.storageId).toBeTruthy();
        }
    })
    test("Making a decision on the license request",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addSolutionToLicense(LicStatus.issued));
        expect(response.body.data.state).toBe(license.catalogs.licStatusByEnum(LicStatus.issued).name);
        expect(response.body.data.recommendation).toBe(TestData.commentValue);
        expect(response.body.data.conclusion).toBe(TestData.commentValue);
        expect(response.body.data.rplCriterias).toBe(TestData.commentValue);
    })
})