import {test, expect, describe} from "@jest/globals";
import superagent from "superagent";
import {TestData} from "../helpers/test-data";
import {Prolicense} from "../class/prolicense";
import {License} from "../class/license";
import {Criterias} from "../class/criterias";
import {Api} from "../helpers/api";
import {Hooks} from "../helpers/hooks/hooks";

describe("Работа с заявками", () => {
    const license = new License();
    const prolicense = new Prolicense();
    const criterias = new Criterias();
    const api = new Api();
    Hooks.beforeLicense(prolicense,license,criterias,api);
    test("Создание заявки в статусе 'Черновик' ",async () => {
        const response = await superagent.put(api.basicUrl+api.request.createLicense).
        send(license.createLicense(prolicense.prolicense));
        expect(response.body.data.proLicId).toBe(prolicense.prolicense[0].id);
        expect(response.body.data.state).toBe(license.licStatusById(response.body.data.stateId));
        expect(response.body.data.percent).toBe(0);
        expect(response.body.data.docState).toBe(license.docStatusById(response.body.data.docStateId));
        license.addRespToLic(0,response.body.data);
        api.fillLicenseApi(license.license[0].id);
        /**
         * Проверяем:
         * 1. Статусы и id документов лицензии
         * 2. Статусы и проценты заполнения групп критериев
         * 3. Статусы и проценты заполнения критериев
         * 4. Статусы документов критериев
         */
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
    test("Добавление документов и комментариев на вкладке Общая информация",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addCommentsAndDocuments());
        /**
         * Проверяем наличие добавленных документов и комментариев
         */
        license.addRespToLic(0,response.body.data);
        license.license[0].documents.forEach((document) => {
            expect(document.comment).toBe(TestData.commentValue);
            expect(document.files.length).toBe(TestData.files.length);
        })
    })
    test("Публикация лицензии", async () => {
        const response = await superagent.put(api.basicUrl + api.request.publishLicense).
        send(license.publishLicense());
        expect(response.body.data.state).toBe(license.license[0].state);
        expect(response.body.data.stateId).toBe(license.license[0].stateId);
        license.addRespToLic(0,response.body.data);
        console.log(license.license[0].name);
    })
    test("Добавление сотрудников клуба и экспертов к группе критериев", async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addClubWorkersToCritGrp());
        /**
         * Проверяем наличие добавленных сотрудников клубов и экспертов для групп критериев
         */
        license.license[0].criteriaGroups.forEach((criteriaGroup, index) => {
            expect(criteriaGroup.experts).toEqual(response.body.data.criteriaGroups[index].experts);
            expect(criteriaGroup.rfuExpert).toBe(response.body.data.criteriaGroups[index].rfuExpert);
        })
        license.addRespToLic(0,response.body.data);
    })
    test("Добавление участников и ОФИ для критериев с типами Участник и ОФИ",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addOfiAndUsers());
        license.addRespToLic(0,response.body.data);
        const criteriaCount = license.catalogs.criteriaTypes.length;
        /**
         * Проверяем наличие добавленных критериев
         */
        license.license[0].criteriaGroups.forEach(critGrp => {
            expect(critGrp.criterias.length).toBeGreaterThan(criteriaCount);
        })
    })
    test("Добавление документов, сотрудников клуба, ОФИ, организаций и комментариев для документов критериев", async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addDataToCritDoc());
        license.addRespToLic(0,response.body.data);
        /**
         * Проверяем значения добавленных комментариев
         * Проверяем , если тип документа = Файл или Документ клуба то массив файлов документа должен быть заполнен,
         * иначе должен быть пуст
         */
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
    test("Проставление статусов и комментариев для документов",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addStatusToDocuments());
        license.addRespToLic(0,response.body.data);
        /**
         * Проверяем проценты заполнения и статусы заявки, групп критериев, критериев
         */
        expect(license.licPercent).toBe(Math.round(license.license[0].percent));
        license.license[0].criteriaGroups.forEach((criteriaGroup) => {
            const grpPercent = criteriaGroup.criterias.reduce((accum,value) =>accum+value.percent,0)/criteriaGroup.criterias.length;
            expect(Math.round(criteriaGroup.percent)).toBe(Math.round(grpPercent));
            if(criteriaGroup.criterias.every(value => value.state == license.docStatusById(1))) {
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
                const critPercent = criteria.documents.filter(value => value.stateId != 2 && value.stateId != 1).length*100/criteria.documents.length;
                expect(Math.round(criteria.percent)).toBe(Math.round(critPercent));
                if (criteria.documents.every(value => value.state == license.docStatusById(1))){
                    expect(criteria.state).toBe(license.docStatusById(1));
                }
                else if (criteria.documents.some(value => value.state == license.docStatusById(5))) {
                    expect(criteria.state).toBe(license.docStatusById(5));
                }
                else if (criteria.documents.some(value => value.state == license.docStatusById(2))) {
                    expect(criteria.state).toBe(license.docStatusById(2));
                }
                else if (criteria.documents.some(value => value.state == license.docStatusById(4))) {
                    expect(criteria.state).toBe(license.docStatusById(4));
                }
                else expect(criteria.state).toBe(license.docStatusById(3));
                criteria.documents.forEach((document) => {
                    expect(document.state).toBe(license.docStatusById(document.stateId));
                })
            })
        })
    })
    test("Создание отчета эксперта", async () => {
        const groupsCount : number = license.catalogs.criteriaGroups.length;
        const firstGrpId : number = license.catalogs.criteriaGroups[0].id;
        for(let i = firstGrpId; i<=groupsCount; i++) {
            const response = await superagent.post(api.basicUrl + api.request.createExpertReport).
            send(license.addExpertReport(i));
            expect(response.body.data.fileName).toBeTruthy();
            expect(response.body.data.storageId).toBeTruthy();
        }
    })
    test("Вынесение решения по заявке",async () => {
        const response = await superagent.put(api.basicUrl + api.request.changeLicense).
        send(license.addSolutionToLicense());
        expect(response.body.data.stateId).toBe(license.catalogs.issuedLicStatus.id);
        expect(response.body.data.state).toBe(license.catalogs.issuedLicStatus.name);
        expect(response.body.data.recommendation).toBe(TestData.commentValue);
        expect(response.body.data.conclusion).toBe(TestData.commentValue);
        expect(response.body.data.rplCriterias).toBe(TestData.commentValue);
    })
})