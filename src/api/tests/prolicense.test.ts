import {jest, test, expect, describe, beforeAll, afterEach} from "@jest/globals";
import superagent, {Response} from "superagent";
import {TestData} from "../helpers/test-data";
import {Prolicense, TDocuments} from "../class/prolicense";
import {Criterias, TCriterias} from "../class/criterias";
import {ProlicenseStatus} from "../helpers/enums/prolicense-status";
import {Api} from "../helpers/api";
jest.setTimeout(120000);

describe("Пролицензия", () => {
    const prolicense = new Prolicense();
    const criterias = new Criterias();
    const api = new Api();

    beforeAll(async () => {
        await TestData.uploadFiles();
        await prolicense.catalogs.fillCatalogsData();
        await criterias.catalogs.fillCatalogsData();
    });
    afterEach(() => api.fillProlicenseApi(prolicense.prolicense));

    test("Создание проекта лицензии", async () => {
        prolicense.createProlicense();
        const response = await superagent.put(api.basicUrl + api.constructors.createProlicense).
        send(prolicense.getProlicense(0));
        expect(response.statusCode).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.type).toBe(prolicense.catalogs.licTypes[0].name);
        expect(response.body.data.season).toBe(prolicense.catalogs.seasons[0].name);
        expect(response.body.data.stateId).toBe(1);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.todayDate);
        expect(response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate).toBe(TestData.futureDate);

        prolicense.addRespToProlic(0,response.body.data);
    })
    test("Изменение проекта лицензии", async () => {
        prolicense.changeProlicense();
        const response = await superagent.put(api.basicUrl + api.constructors.changeProlicense).
        send(prolicense.getProlicense(0));
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
    })
    test("Получение проекта лицензии по ID", async () => {
        const response = await superagent.get(api.basicUrl + api.constructors.changeProlicense);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).toBe(prolicense.getProlicense(0).id);
        expect(response.body.data.type).toBe(prolicense.getProlicense(0).type);
        expect(response.body.data.season).toBe(prolicense.getProlicense(0).season);
        expect(response.body.data.name).toBe(prolicense.getProlicense(0).name);
        expect(response.body.data.documents.length).toBe(prolicense.getProlicense(0).documents.length);
        prolicense.addRespToProlic(0,response.body.data);
    })
    test("Создание группы критериев пролицензии", async () => {
        criterias.createCritGroups();
        for (const criteriaGroup of criterias.criterias) {
            const response = await superagent.put(api.basicUrl + api.constructors.createCriteriaGrp).
            query({groupId: criteriaGroup.id, experts: criteriaGroup.experts});
            expect(response.statusCode).toBe(200);
            expect(response.body.status).toBe("SUCCESS");
        }
    })
    test("Создание критерия пролицензии", async () => {
        criterias.createCriterias();
        for(const criteriaGroup of criterias.criterias){
            for(let criteria of criteriaGroup.criterias) {
                const index = criteriaGroup.criterias.indexOf(criteria);
                const response = await superagent.put(api.basicUrl + api.constructors.createCriterias).
                send(criteria);
                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                expect(response.body.data.id).toBeDefined();
                expect(response.body.data.documents.length).toEqual(criteria.documents.length);
                expect(response.body.data.number).toBe(criteria.number);
                criteriaGroup.criterias[index] = response.body.data;
            }
        }
    })
    test("Изменение критериев пролицензии", async () => {
        criterias.changeCriterias();
        for (const criteriaGroup of criterias.criterias) {
            for (const criteria of criteriaGroup.criterias) {
                const response = await superagent.put(api.basicUrl + api.constructors.changeCriterias + criteria.id).
                send(criteria)
                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
            }
        }
    })
    test("Получение полной информации о критериях пролицензии", async () => {
        const response = await superagent.get(api.basicUrl + api.constructors.createCriterias);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.groups.length).toBeGreaterThan(0);
        response.body.data.groups.forEach((criteriaGroup: TCriterias, index: number) => {
            criteriaGroup.criterias.forEach((criteria, index1) => {
                expect(criteria.name).toBe(criterias.criterias[index].criterias[index1].name);
                expect(criteria.number).toBe(criterias.criterias[index].criterias[index1].number);
                expect(criteria.categoryId).toBe(criterias.criterias[index].criterias[index1].categoryId);
                expect(criteria.documents).not.toEqual(criterias.criterias[index].criterias[index1].documents);
                criteria.documents = criterias.criterias[index].criterias[index1].documents;
            })
        })
    })
    test("Создание пролицензии по образцу", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.cloneProlicense).
        send(prolicense.createSampleProlicense());
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).not.toBe(prolicense.getProlicense(0).id);
        expect(
            response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate
        ).toBe(TestData.futureDate);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.todayDate);
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
    test("Удаление пролицензии", async () => {
        const response = await superagent.delete(api.basicUrl + api.constructors.deleteProlicense);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense.pop();
    })
    test("Удаление критерия пролицензии", async () => {
        for (const criteriaGroup of criterias.criterias) {
            if (criteriaGroup.id % 2 == 0) {
                for (const criteria of criteriaGroup.criterias) {
                    const response = await superagent.delete(api.basicUrl + api.constructors.changeCriterias + criteria.id);
                    expect(response.statusCode).toBe(200);
                    expect(response.body.status).toBe("SUCCESS");
                }
                criteriaGroup.criterias = [];
            }
        }
    })
    test("Удаление группы критериев", async () => {
        for (let i = 0; i<criterias.criterias.length; i++) {
            if (criterias.criterias[i].id % 2 == 0) {
                const response = await superagent.delete(api.basicUrl + api.constructors.deleteCriteriasGrp + criterias.criterias[i].id);
                expect(response.statusCode).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                criterias.criterias.splice(i,1);
            }
        }
    })
    test("Публикация проекта лицензии",async () => {
        const response = await superagent.put(api.basicUrl+api.constructors.publishProlicense);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense[0].stateId = ProlicenseStatus.published;
    })
    test("Снятие с публикации проекта лицензии", async () => {
        const response = await superagent.put(api.basicUrl + api.constructors.unpublishProlicense);
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense[0].stateId = ProlicenseStatus.unpublished;
        console.log(prolicense.prolicense[0].name);
    })
})