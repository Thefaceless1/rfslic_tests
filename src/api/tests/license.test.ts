import {describe, expect, test} from "@jest/globals";
import {TestData} from "../helpers/test-data";
import {License} from "../helpers/license";
import {Hooks} from "../helpers/hooks/hooks";
import {LicStatus} from "../helpers/enums/license-status";
import {DocumentStatus} from "../helpers/enums/document-status";
import {CriteriaTypes} from "../helpers/enums/criteria-types";

describe("License requests", () => {
    const license = new License();
    Hooks.beforeLicense(license);

    test("Creating a request in 'draft' status",async () => {
        await license.createLicense()
        expect(license.license[0].proLicId).toBe(license.prolicense[0].id);
        expect(license.license[0].state).toBe(LicStatus.new);
        expect(license.license[0].percent).toBe(0);
        expect(license.license[0].docState).toBe(DocumentStatus.form);
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
    test("Publish license", async () => {
        await license.publishLicense();
        expect(license.license[0].stateId).toBe(license.licStatusByEnum(LicStatus.inWork).id);
        expect(license.license[0].state).toBe(license.licStatusByEnum(LicStatus.inWork).name);
    })
    test("Adding documents and comments on the 'General Information' tab",async () => {
        await license.addCommentsAndDocuments();
        license.license[0].documents.forEach((document) => {
            expect(document.comment).toBe(TestData.commentValue);
            expect(document.files.length).toBe(license.files.length);
        })
    })
    test("Adding rfu experts to criteria groups", async () => {
        await license.addRfuExperts();
        license.license[0].criteriaGroups.forEach((criteriaGroup) => {
            expect(criteriaGroup.rfuExpert).toBe(license.selectedRfuExpertId);
        })
    })
    test("Adding club experts to criteria groups", async () => {
        await license.addClubExperts();
        for(const group of license.license[0].criteriaGroups) {
            expect(group.experts.length).toBeGreaterThan(0);
        }
    })
    test("Adding participants and OFI for criterias with Participant and OFI types",async () => {
        await license.addOfiAndUsers();
        for(const group of license.license[0].criteriaGroups) {
            for(const criteria of group.criterias) {
                if(criteria.typeId == CriteriaTypes.participant) expect(criteria.externalId).toBe(license.selectedClubWorkerId);
                else if(criteria.typeId == CriteriaTypes.ofi) expect(criteria.externalId).toBe(license.selectedOfiId);
            }
        }
    })
    test("Adding files and comments for criteria documents", async () => {
        await license.addDataToCritDoc();
        license.license[0].criteriaGroups.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.documents.forEach((document) => {
                    expect(document.comment).toBe(TestData.commentValue);
                    expect(document.files.length).toEqual(license.files.length);
                })
            })
        })
    })
    test("Removing general info document file",async () => {
        await license.deleteGeneralInfoDocFile();
        expect(license.license[0].documents.find(document => document.id == license.removedFileId)).toBeFalsy();
    })
    test("Removing criteria document file",async () => {
        const isRemovedFile: boolean = await license.deleteCriteriaDocFile();
        expect(isRemovedFile).toBeTruthy();
    })
    test("Send for verification general info documents",async () => {
        await license.checkGeneralInfoDocs();
        for(const document of license.license[0].documents) {
            expect(document.state).toBe(DocumentStatus.underReview);
        }
    })
    test("Send for verification criteria documents",async () => {
        await license.checkCriteriaDocs();
        for(const group of license.license[0].criteriaGroups) {
            for(const criteria of group.criterias) {
                expect(criteria.documents.every(document => document.state == DocumentStatus.underReview)).toBeTruthy();
            }
        }
    })
    test("Setting statuses and comments for documents",async () => {
        await license.addStatusToDocuments();
        expect(license.licPercent).toBe(Math.round(license.license[0].percent));
        license.license[0].criteriaGroups.forEach((criteriaGroup) => {
            const grpPercent = criteriaGroup.criterias.reduce((accum,item) =>accum+item.percent,0)/criteriaGroup.criterias.length;
            expect(Math.round(criteriaGroup.percent)).toBe(Math.round(grpPercent));
            if(criteriaGroup.criterias.some(criteria => criteria.state == DocumentStatus.form)) {
                expect(criteriaGroup.state).toBe(DocumentStatus.form);
            }
            else if (criteriaGroup.criterias.some(criteria => criteria.state == DocumentStatus.declined)) {
                expect(criteriaGroup.state).toBe(DocumentStatus.declined);
            }
            else if (criteriaGroup.criterias.some(criteria => criteria.state == DocumentStatus.underReview)) {
                expect(criteriaGroup.state).toBe(DocumentStatus.underReview);
            }
            else if (criteriaGroup.criterias.some(criteria => criteria.state == DocumentStatus.acceptedWithCondition)) {
                expect(criteriaGroup.state).toBe(DocumentStatus.acceptedWithCondition);
            }
            else expect(criteriaGroup.state).toBe(DocumentStatus.accepted);
            criteriaGroup.criterias.forEach((criteria) => {
                expect(Math.round(criteria.percent)).toBe(license.criteriaPercent(criteriaGroup, criteria));
                if (license.criteriaDocuments(criteriaGroup,criteria).some(document => document.state == DocumentStatus.form)){
                    expect(criteria.state).toBe(DocumentStatus.form);
                }
                else if (license.criteriaDocuments(criteriaGroup,criteria).some(document => document.state == DocumentStatus.declined)) {
                    expect(criteria.state).toBe(DocumentStatus.declined);
                }
                else if (license.criteriaDocuments(criteriaGroup,criteria).some(document => document.state == DocumentStatus.underReview)) {
                    expect(criteria.state).toBe(DocumentStatus.underReview);
                }
                else if (license.criteriaDocuments(criteriaGroup,criteria).some(document => document.state == DocumentStatus.acceptedWithCondition)) {
                    expect(criteria.state).toBe(DocumentStatus.acceptedWithCondition);
                }
                else expect(criteria.state).toBe(DocumentStatus.accepted);
            })
        })
    })
    test("Creating an expert report", async () => {
        await license.addExpertReport();
        for(const group of license.license[0].criteriaGroups) {
            expect(group.recommendation).toBe(TestData.commentValue);
            expect(group.reportName).toBeTruthy();
            expect(group.reportStorageId).toBeTruthy();
        }
    })
    test("Adding decision, recommendation and rpl criterias for a request",async () => {
        await license.addConclusions();
        expect(license.license[0].recommendation).toBe(TestData.commentValue);
        expect(license.license[0].conclusion).toBe(TestData.commentValue);
        expect(license.license[0].rplCriterias).toBe(TestData.commentValue);
    })
    test("Changing request status",async () => {
        await license.changeLicStatus();
        expect(license.license[0].state).toBe(LicStatus.waitForCommission);
    })
})