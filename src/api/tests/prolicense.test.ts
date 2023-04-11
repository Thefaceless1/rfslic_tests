import {test, expect, describe} from "@jest/globals";
import superagent from "superagent";
import {TestData} from "../helpers/test-data";
import {Prolicense} from "../helpers/prolicense";
import {TCriterias, TDocuments} from "../helpers/types/prolicense.type";
import {ProlicenseStatus} from "../helpers/enums/prolicense-status";
import {Api} from "../helpers/api";
import {Hooks} from "../helpers/hooks/hooks";

describe("Prolicense", () => {
    const prolicense = new Prolicense();
    const api = new Api();
    Hooks.beforeProlic(prolicense);
    Hooks.afterEachProlic(prolicense,api);
    test("Creating a license project", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.createProlicense).
        send(prolicense.createProlicense()).
        set("cookie", `${prolicense.cookie}`).
        set("x-csrf-token",prolicense.x_csrf_token);
        expect(response.body.data.id).toBeTruthy();
        expect(response.body.data.type).toBe(prolicense.licTypes[0].name);
        expect(response.body.data.season).toBe(prolicense.seasons[0].name);
        expect(response.body.data.stateId).toBe(ProlicenseStatus.unpublished);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.currentDate);
        expect(response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate).toBe(TestData.futureDate);

        prolicense.fillProlicense(0,response);
    })
    test("Changing the license project", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.changeProlicense).
        send(prolicense.changeProlicense()).
        set("cookie", `${prolicense.cookie}`).
        set("x-csrf-token",prolicense.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
        await prolicense.refreshProlicense(api);
    })
    test("Creating prolicense criteria groups", async () => {
        prolicense.createCritGroups();
        for (const criteriaGroup of prolicense.criterias) {
            const response = await superagent.put(api.basicUrl + api.constructors.createCriteriaGrp).
            query({groupId: criteriaGroup.id, experts: criteriaGroup.experts}).
            set("cookie", `${prolicense.cookie}`).
            set("x-csrf-token",prolicense.x_csrf_token);
            expect(response.body.status).toBe("SUCCESS");
        }
    })
    test("Creating prolicense criterias", async () => {
        prolicense.createCriterias();
        for(const criteriaGroup of prolicense.criterias){
            for(let criteria of criteriaGroup.criterias) {
                const index = criteriaGroup.criterias.indexOf(criteria);
                const response = await superagent.put(api.basicUrl + api.constructors.createCriterias).
                send(criteria).
                set("cookie", `${prolicense.cookie}`).
                set("x-csrf-token",prolicense.x_csrf_token);
                expect(response.body.data.id).toBeTruthy();
                expect(response.body.data.documents.length).toEqual(criteria.documents.length);
                expect(response.body.data.number).toBe(criteria.number);
                criteriaGroup.criterias[index] = response.body.data;
            }
        }
    })
    test("Changing prolicense criterias", async () => {
        prolicense.changeCriterias();
        for (const criteriaGroup of prolicense.criterias) {
            for (const criteria of criteriaGroup.criterias) {
                const response = await superagent.put(api.basicUrl + api.constructors.changeCriterias + criteria.id).
                send(criteria).
                set("cookie", `${prolicense.cookie}`).
                set("x-csrf-token",prolicense.x_csrf_token);
                expect(response.body.status).toBe("SUCCESS");
            }
        }
    })
    test("Getting full information about prolicense criterias", async () => {
        const response = await superagent.get(api.basicUrl + api.constructors.createCriterias).
        set("cookie", `${prolicense.cookie}`).
        set("x-csrf-token",prolicense.x_csrf_token);
        expect(response.body.data.groups.length).toBeGreaterThan(0);
        response.body.data.groups.forEach((criteriaGroup: TCriterias, index: number) => {
            criteriaGroup.criterias.forEach((criteria, criteriaIndex) => {
                expect(criteria.name).toBe(prolicense.criterias[index].criterias[criteriaIndex].name);
                expect(criteria.number).toBe(prolicense.criterias[index].criterias[criteriaIndex].number);
                expect(criteria.categoryId).toBe(prolicense.criterias[index].criterias[criteriaIndex].categoryId);
                expect(criteria.documents).not.toEqual(prolicense.criterias[index].criterias[criteriaIndex].documents);
                criteria.documents = prolicense.criterias[index].criterias[criteriaIndex].documents;
            })
        })
    })
    test("Copy the prolicense", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.cloneProlicense).
        send(prolicense.createSampleProlicense()).
        set("cookie", `${prolicense.cookie}`).
        set("x-csrf-token",prolicense.x_csrf_token);
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
    test("Removing a prolicense", async () => {
        const response = await superagent.delete(api.basicUrl + api.constructors.deleteProlicense).
        set("cookie", `${prolicense.cookie}`).
        set("x-csrf-token",prolicense.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense.pop();
    })
    test("Removing prolicense criterias", async () => {
        for (const criteriaGroup of prolicense.criterias) {
            if (criteriaGroup.id % 2 == 0) {
                for (const criteria of criteriaGroup.criterias) {
                    const response = await superagent.delete(api.basicUrl + api.constructors.changeCriterias + criteria.id).
                    set("cookie", `${prolicense.cookie}`).
                    set("x-csrf-token",prolicense.x_csrf_token);
                    expect(response.body.status).toBe("SUCCESS");
                }
                criteriaGroup.criterias = [];
            }
        }
    })
    test("Removing criteria groups", async () => {
        for (let i = 0; i<prolicense.criterias.length; i++) {
            if (prolicense.criterias[i].id % 2 == 0) {
                const response = await superagent.delete(api.basicUrl + api.constructors.deleteCriteriasGrp + prolicense.criterias[i].id).
                set("cookie", `${prolicense.cookie}`).
                set("x-csrf-token",prolicense.x_csrf_token);
                expect(response.body.status).toBe("SUCCESS");
                prolicense.criterias.splice(i,1);
            }
        }
    })
    test("Publish prolicense",async () => {
        const response = await superagent.put(api.basicUrl+api.constructors.publishProlicense).
        set("cookie", `${prolicense.cookie}`).
        set("x-csrf-token",prolicense.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense[0].stateId = ProlicenseStatus.published;
    })
    test("Removing of the prolicense from publication", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.unpublishProlicense).
        set("cookie", `${prolicense.cookie}`).
        set("x-csrf-token",prolicense.x_csrf_token);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense[0].stateId = ProlicenseStatus.unpublished;
    })
})