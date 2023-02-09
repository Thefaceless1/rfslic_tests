import {test, expect, describe} from "@jest/globals";
import superagent from "superagent";
import {TestData} from "../helpers/test-data";
import {Prolicense, TDocuments} from "../helpers/prolicense";
import {Criterias, TCriterias} from "../helpers/criterias";
import {ProlicenseStatus} from "../helpers/enums/prolicense-status";
import {Api} from "../helpers/api";
import {Hooks} from "../helpers/hooks/hooks";

describe("Prolicense", () => {
    const prolicense = new Prolicense();
    const criterias = new Criterias();
    const api = new Api();
    Hooks.beforeProlic(prolicense,criterias);
    Hooks.afterEachProlic(prolicense,api);
    test("Creating a license project", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.createProlicense).
        send(prolicense.createProlicense());
        expect(response.body.data.id).toBeTruthy();
        expect(response.body.data.type).toBe(prolicense.catalogs.licTypes[0].name);
        expect(response.body.data.season).toBe(prolicense.catalogs.seasons[0].name);
        expect(response.body.data.stateId).toBe(ProlicenseStatus.unpublished);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.currentDate);
        expect(response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate).toBe(TestData.futureDate);

        prolicense.fillProlicense(0,response);
    })
    test("Changing the license project", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.changeProlicense).
        send(prolicense.changeProlicense());
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Getting the license project by ID", async () => {
        const response = await superagent.get(api.basicUrl + api.constructors.changeProlicense);
        expect(response.body.data.id).toBe(prolicense.prolicense[0].id);
        expect(response.body.data.type).toBe(prolicense.prolicense[0].type);
        expect(response.body.data.season).toBe(prolicense.prolicense[0].season);
        expect(response.body.data.name).toBe(prolicense.prolicense[0].name);
        expect(response.body.data.documents.length).toBe(prolicense.prolicense[0].documents.length);
        prolicense.fillProlicense(0,response);
    })
    test("Creating prolicense criteria groups", async () => {
        criterias.createCritGroups();
        for (const criteriaGroup of criterias.criterias) {
            const response = await superagent.put(api.basicUrl + api.constructors.createCriteriaGrp).
            query({groupId: criteriaGroup.id, experts: criteriaGroup.experts});
            expect(response.body.status).toBe("SUCCESS");
        }
    })
    test("Creating prolicense criterias", async () => {
        criterias.createCriterias();
        for(const criteriaGroup of criterias.criterias){
            for(let criteria of criteriaGroup.criterias) {
                const index = criteriaGroup.criterias.indexOf(criteria);
                const response = await superagent.put(api.basicUrl + api.constructors.createCriterias).
                send(criteria);
                expect(response.body.data.id).toBeTruthy();
                expect(response.body.data.documents.length).toEqual(criteria.documents.length);
                expect(response.body.data.number).toBe(criteria.number);
                criteriaGroup.criterias[index] = response.body.data;
            }
        }
    })
    test("Changing prolicense criterias", async () => {
        criterias.changeCriterias();
        for (const criteriaGroup of criterias.criterias) {
            for (const criteria of criteriaGroup.criterias) {
                const response = await superagent.put(api.basicUrl + api.constructors.changeCriterias + criteria.id).
                send(criteria)
                expect(response.body.status).toBe("SUCCESS");
            }
        }
    })
    test("Getting full information about prolicense criterias", async () => {
        const response = await superagent.get(api.basicUrl + api.constructors.createCriterias);
        expect(response.body.data.groups.length).toBeGreaterThan(0);
        response.body.data.groups.forEach((criteriaGroup: TCriterias, index: number) => {
            criteriaGroup.criterias.forEach((criteria, criteriaIndex) => {
                expect(criteria.name).toBe(criterias.criterias[index].criterias[criteriaIndex].name);
                expect(criteria.number).toBe(criterias.criterias[index].criterias[criteriaIndex].number);
                expect(criteria.categoryId).toBe(criterias.criterias[index].criterias[criteriaIndex].categoryId);
                expect(criteria.documents).not.toEqual(criterias.criterias[index].criterias[criteriaIndex].documents);
                criteria.documents = criterias.criterias[index].criterias[criteriaIndex].documents;
            })
        })
    })
    test("Copy the prolicense", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.cloneProlicense).
        send(prolicense.createSampleProlicense());
        expect(response.body.data.id).not.toBe(prolicense.prolicense[0].id);
        expect(
            response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate
        ).toBe(TestData.futureDate);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.currentDate);
        expect(response.body.data.stateId).toBe(1);
        response.body.data.documents.forEach((document : TDocuments, index : number) =>{
        expect(document.name).toBe(prolicense.prolicense[0].documents[index].name);
            document.templates.forEach((template, index1) => {
            expect(template.name).toBe(prolicense.prolicense[0].documents[index].templates[index1].name);
            expect(template.storageId).toBe(prolicense.prolicense[0].documents[index].templates[index1].storageId);
        })
    })
        prolicense.prolicense.push(response.body.data);
    })
    test("Removal the prolicense", async () => {
        const response = await superagent.delete(api.basicUrl + api.constructors.deleteProlicense);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense.pop();
    })
    test("Removal prolicense criterias", async () => {
        for (const criteriaGroup of criterias.criterias) {
            if (criteriaGroup.id % 2 == 0) {
                for (const criteria of criteriaGroup.criterias) {
                    const response = await superagent.delete(api.basicUrl + api.constructors.changeCriterias + criteria.id);
                    expect(response.body.status).toBe("SUCCESS");
                }
                criteriaGroup.criterias = [];
            }
        }
    })
    test("Removal criteria groups", async () => {
        for (let i = 0; i<criterias.criterias.length; i++) {
            if (criterias.criterias[i].id % 2 == 0) {
                const response = await superagent.delete(api.basicUrl + api.constructors.deleteCriteriasGrp + criterias.criterias[i].id);
                expect(response.body.status).toBe("SUCCESS");
                criterias.criterias.splice(i,1);
            }
        }
    })
    test("Publish prolicense",async () => {
        const response = await superagent.put(api.basicUrl+api.constructors.publishProlicense);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense[0].stateId = ProlicenseStatus.published;
    })
    test("Removal of the prolicense from publication", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.unpublishProlicense);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense[0].stateId = ProlicenseStatus.unpublished;
    })
})