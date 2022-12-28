import {jest, test, expect, describe, beforeAll, afterEach} from "@jest/globals";
import superagent from "superagent";
import {RequestProp} from "../helpers/request-prop";
import {TestData} from "../helpers/test-data";
import {Catalogs,TCurrentSeason} from "../class/catalogs";
import {Prolicense, TDocuments} from "../class/prolicense";
import {Criterias, TCriterias} from "../class/criterias";
jest.setTimeout(60000);

describe("Пролицензия", () => {
    const prolicense = new Prolicense();
    const catalogs = new Catalogs();
    const criterias = new Criterias();
    const api = new RequestProp();
    beforeAll(async () => await catalogs.fillCatalogsData());
    afterEach(() => api.fillProlicenseApi(prolicense.prolicense));
    test("Создание проекта лицензии", async () => {
        Prolicense.createProlicense(prolicense.prolicense,catalogs.seasons,catalogs.licTypes,catalogs.docTypes);
        const response = await superagent.put(RequestProp.basicUrl + api.constructors.createProlicense).
        send(Prolicense.getProlicense(prolicense.prolicense,0));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.type).toBe(catalogs.licTypes[0].name);
        expect(response.body.data.season).toBe(catalogs.seasons[0].name);
        expect(response.body.data.stateId).toBe(1);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.getTodayDate);
        expect(response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate).toBe(TestData.getFutureDate);

        Prolicense.addResponseToProlicense(prolicense.prolicense,0,response.body.data);
    })
    test("Изменение проекта лицензии", async () => {
        //Меняем наименование, тип , сезон пролицензии и добавляем второй документ
        Prolicense.changeProlicense(prolicense.prolicense,catalogs.seasons,catalogs.licTypes,catalogs.docTypes);
        const response = await superagent.put(RequestProp.basicUrl + api.constructors.changeProlicense).
        send(Prolicense.getProlicense(prolicense.prolicense,0));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data).toEqual({});
    })
    test("Получение проекта лицензии по ID", async () => {
        const response = await superagent.get(RequestProp.basicUrl + api.constructors.changeProlicense);
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).toBe(Prolicense.getProlicense(prolicense.prolicense,0).id);
        expect(response.body.data.type).toBe(Prolicense.getProlicense(prolicense.prolicense,0).type);
        expect(response.body.data.season).toBe(Prolicense.getProlicense(prolicense.prolicense,0).season);
        expect(response.body.data.name).toBe(Prolicense.getProlicense(prolicense.prolicense,0).name);
        expect(response.body.data.documents.length).toBe(Prolicense.getProlicense(prolicense.prolicense,0).documents.length);
        Prolicense.addResponseToProlicense(prolicense.prolicense,0,response.body.data);
    })
    test("Создание группы критериев пролицензии", async () => {
        Criterias.createCritGroups(criterias.criterias,catalogs.criteriaGroups,catalogs.critGrpExperts);
        for (const i of criterias.criterias) {
            const response = await superagent.put(RequestProp.basicUrl + api.constructors.createCriteriaGrp).
            query(
                {
                    groupId: i.id,
                    experts: i.experts
                }
            );
            expect(response.ok).toBeTruthy();
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("SUCCESS");
            expect(response.body.data).toEqual({});
        }
    })
    test("Создание критерия пролицензии", async () => {
        Criterias.createCriterias(criterias.criterias,catalogs.criteriaTypes,catalogs.rankCriteria,catalogs.docTypes);
        for(const i of criterias.criterias){
            for(let criteria of i.criterias) {
                const index = i.criterias.indexOf(criteria);
                const response = await superagent.put(RequestProp.basicUrl + api.constructors.createCriterias).
                send(criteria);
                expect(response.ok).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                expect(response.body.data.id).toBeDefined();
                expect(response.body.data.documents.length).toEqual(criteria.documents.length);
                expect(response.body.data.number).toBe(criteria.number);
                i.criterias[index] = response.body.data;
            }
        }
    })
    test("Изменение критериев пролицензии", async () => {
        Criterias.changeCriterias(criterias.criterias,catalogs.rankCriteria,catalogs.docTypes);
        for (const i of criterias.criterias) {
            for (const criteria of i.criterias) {
                const response = await superagent.put(RequestProp.basicUrl + api.constructors.changeCriterias + criteria.id).
                send(criteria)
                expect(response.ok).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                expect(response.body.data).toEqual({});
            }
        }
    })
    test("Получение полной информации о критериях пролицензии", async () => {
        const response = await superagent.get(RequestProp.basicUrl + api.constructors.createCriterias);
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.groups.length).toBeGreaterThan(0);
        expect(response.body.data.groups.every((value: TCriterias) => value.criterias.length == catalogs.criteriaTypes.length)).toBeTruthy();
        response.body.data.groups.forEach((value: TCriterias, index: number) => {
            value.criterias.forEach((value1, index1) => {
                expect(value1.name).toBe(criterias.criterias[index].criterias[index1].name);
                expect(value1.number).toBe(criterias.criterias[index].criterias[index1].number);
                expect(value1.categoryId).toBe(criterias.criterias[index].criterias[index1].categoryId);
                expect(value1.documents).not.toEqual(criterias.criterias[index].criterias[index1].documents);
                value1.documents = criterias.criterias[index].criterias[index1].documents;
            })
        })
    })
    test("Создание пролицензии по образцу", async () => {
        const response = await superagent.put(RequestProp.basicUrl + api.constructors.cloneProlicense).
        send(Prolicense.createSampleProlicense(catalogs.seasons,catalogs.licTypes));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).not.toBe(Prolicense.getProlicense(prolicense.prolicense,0).id);
        expect(
            response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate
        ).toBe(TestData.getFutureDate);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.getTodayDate);
        expect(response.body.data.stateId).toBe(1);
        response.body.data.documents.forEach((value : TDocuments, index : number) =>{
        expect(value.name).toBe(prolicense.prolicense[0].documents[index].name);
        value.templates.forEach((value1, index1) => {
            expect(value1.name).toBe(prolicense.prolicense[0].documents[index].templates[index1].name);
            expect(value1.storageId).toBe(prolicense.prolicense[0].documents[index].templates[index1].storageId);
        })
    })
        prolicense.prolicense.push(response.body.data);
    })
    test("Удаление пролицензии", async () => {
        const response = await superagent.delete(RequestProp.basicUrl + api.constructors.deleteProlicense);
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        prolicense.prolicense.pop();
    })
    test("Удаление критерия пролицензии", async () => {
        for (const i of criterias.criterias) {
            if (i.id % 2 == 0) {
                for (const criteria of i.criterias) {
                    const response = await superagent.delete(RequestProp.basicUrl + api.constructors.changeCriterias + criteria.id);
                    expect(response.ok).toBeTruthy();
                    expect(response.status).toBe(200);
                    expect(response.body.status).toBe("SUCCESS");
                }
                i.criterias = [];
            }
        }
    })
    test("Удаление группы критериев", async () => {
        for (let i = 0; i<criterias.criterias.length; i++) {
            if (criterias.criterias[i].id % 2 == 0) {
                const response = await superagent.delete(RequestProp.basicUrl + api.constructors.deleteCriteriasGrp + criterias.criterias[i].id);
                expect(response.ok).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                criterias.criterias.splice(i,1);
            }
        }
    })
    test("Публикация проекта лицензии",async () => {
        const response = await superagent.put(RequestProp.basicUrl+api.constructors.publishProlicense);
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data).toEqual({});
        prolicense.prolicense[0].stateId = 2;
    })
})