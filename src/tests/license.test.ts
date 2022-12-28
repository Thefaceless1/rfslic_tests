import {jest, test, expect, describe, beforeAll, beforeEach, afterEach} from "@jest/globals";
import superagent from "superagent";
import {RequestProp} from "../helpers/request-prop";
import {TestData} from "../helpers/test-data";
import {Catalogs,TCurrentSeason} from "../class/catalogs";
import {Prolicense, TDocuments} from "../class/prolicense";
import {License} from "../class/license";
import {Criterias, TCriterias} from "../class/criterias";
jest.setTimeout(60000);

describe("Работа с заявками", () => {
    const catalogs = new Catalogs();
    const prolicense = new Prolicense();
    const criterias = new Criterias();
    const api = new RequestProp();
    beforeAll(async () => {
        await catalogs.fillCatalogsData();
        await Prolicense.createTestProlicense(prolicense.prolicense,catalogs.seasons,catalogs.licTypes,catalogs.docTypes);
        await api.fillProlicenseApi(prolicense.prolicense);
        await Criterias.createTestCriterias(
            criterias.criterias,prolicense.prolicense,
            catalogs.criteriaGroups,catalogs.critGrpExperts,
            catalogs.criteriaTypes,catalogs.rankCriteria,catalogs.docTypes,api.constructors);
    })
    test("Создание заявки в статусе 'Черновик' ",async () => {
        const response = await superagent.put(RequestProp.basicUrl+api.request.createLicense).
        send(License.createLicense(prolicense.prolicense));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.proLicId).toBe(prolicense.prolicense[0].id);
        expect(response.body.data.state).toBe(License.getLicStatusById(response.body.data.stateId,catalogs.licStatus));
        expect(response.body.data.percent).toBe(0);
        expect(response.body.data.docState).toBe(License.getDocStatusById(response.body.data.docStateId,catalogs.docStatus));
        License.addResponseToLicense(0,response.body.data);
        api.fillLicenseApi(License.license[0].id);
        //Проверяем статусы документов лицензии
        License.license[0].documents.forEach((value, index) => {
            expect(value.state).toBe(License.getDocStatusById(response.body.data.docStateId,catalogs.docStatus));
            expect(value.proDocId).toBe(prolicense.prolicense[0].documents[index].id);
        })
        //Проверяем статусы и проценты заполнения групп критериев
        License.license[0].criteriaGroups.forEach((value, index) => {
            expect(value.groupId).toBe(criterias.criterias[index].id);
            expect(value.state).toBe(License.getDocStatusById(value.stateId,catalogs.docStatus));
            expect(value.percent).toBe(0.0);
            //Проверяем статусы и проценты заполнения критериев
            value.criterias.forEach((value1, index1) => {
                expect(value1.state).toBe(License.getDocStatusById(value1.stateId,catalogs.docStatus));
                expect(value1.percent).toBe(0.0);
                //Проверяем статусы документов критериев
                value1.documents.forEach(value2 => {
                    expect(value2.state).toBe(License.getDocStatusById(value2.stateId,catalogs.docStatus));
                })
            })
        })
    })
    test("Добавление документов и комментариев на вкладке Общая информация",async () => {
        const response = await superagent.put(RequestProp.basicUrl + api.request.changeLicense).
        send(License.addCommentsAndDocuments());
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        License.addResponseToLicense(0,response.body.data);
        //проверяем наличие добавленных документов и комментариев
        License.license[0].documents.forEach((value, index) => {
            expect(value.comment).toBe(TestData.commentValue);
            expect(value.files.length).toBe(TestData.files.length);
        })
    })
    test("Публикация лицензии", async () => {
        const response = await superagent.put(RequestProp.basicUrl + api.request.publishLicense).
        send(License.publishLicense());
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.state).toBe(License.license[0].state);
        expect(response.body.data.stateId).toBe(License.license[0].stateId);
        License.addResponseToLicense(0,response.body.data);
    })
    test("Добавление сотрудников клуба и экспертов к группе критериев", async () => {
        const response = await superagent.put(RequestProp.basicUrl + api.request.changeLicense).
        send(License.addClubWorkersToCritGrp(catalogs.clubWorkers,catalogs.critGrpExperts));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        //Проверяем наличие добавленных сотрудников клубов и экспертов для групп критериев
        License.license[0].criteriaGroups.forEach((value, index) => {
            expect(value.experts).toEqual(response.body.data.criteriaGroups[index].experts);
            expect(value.rfuExpert).toBe(response.body.data.criteriaGroups[index].rfuExpert);
        })
        License.addResponseToLicense(0,response.body.data);
    })
    test("Добавление документов и комментариев для документов критериев", async () => {
        const response = await superagent.put(RequestProp.basicUrl + api.request.changeLicense).
        send(License.addDocAndComToCritDoc());
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        License.addResponseToLicense(0,response.body.data);
        //Проверяем наличие добавленных комментариев и документов для документов критериев
        License.license[0].criteriaGroups.forEach((value, index) => {
            value.criterias.forEach((value1,index1) => {
                value1.documents.forEach((value2, index2) => {
                    const addedDocInfo = response.body.data.criteriaGroups[index].criterias[index1].documents[index2];
                    expect(value2.comment).toBe(TestData.commentValue);
                    expect(value2.files.length).toEqual(TestData.files.length);
                })
            })
        })
    })
    test("Проставление статусов и комментариев для документов критериев",async () => {
        const response = await superagent.put(RequestProp.basicUrl + api.request.changeLicense).
        send(License.addStatusToDocuments(catalogs.docStatus));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        License.addResponseToLicense(0,response.body.data);
        //Проверяем проценты заполнения и статусы заявки, групп критериев, критериев
        License.license[0].criteriaGroups.forEach((grp, index) => {
            const grpPercent = grp.criterias.reduce((accum,value) =>accum+value.percent,0)/grp.criterias.length;
            expect(Math.round(grp.percent)).toBe(Math.round(grpPercent));
            if(grp.criterias.every(value => value.state == License.getDocStatusById(1,catalogs.docStatus))) {
                expect(grp.state).toBe(License.getDocStatusById(1,catalogs.docStatus));
            }
            else if (grp.criterias.some(value => value.state == License.getDocStatusById(5,catalogs.docStatus))) {
                expect(grp.state).toBe(License.getDocStatusById(5,catalogs.docStatus));
            }
            else if (grp.criterias.some(value => value.state == License.getDocStatusById(2,catalogs.docStatus))) {
                expect(grp.state).toBe(License.getDocStatusById(2,catalogs.docStatus));
            }
            else if (grp.criterias.some(value => value.state == License.getDocStatusById(4,catalogs.docStatus))) {
                expect(grp.state).toBe(License.getDocStatusById(4,catalogs.docStatus));
            }
            expect(grp.state).toBe(License.getDocStatusById(3,catalogs.docStatus));
            grp.criterias.forEach((crit, index1) => {
                const critPercent = crit.documents.filter(value => value.stateId != 2).length*100/crit.documents.length;
                expect(Math.round(crit.percent)).toBe(Math.round(critPercent));
                if (crit.documents.every(value => value.state == License.getDocStatusById(1,catalogs.docStatus))){
                    expect(crit.state).toBe(License.getDocStatusById(1,catalogs.docStatus));
                }
                else if (crit.documents.some(value => value.state == License.getDocStatusById(5,catalogs.docStatus))) {
                    expect(crit.state).toBe(License.getDocStatusById(5,catalogs.docStatus));
                }
                else if (crit.documents.some(value => value.state == License.getDocStatusById(2,catalogs.docStatus))) {
                    expect(crit.state).toBe(License.getDocStatusById(2,catalogs.docStatus));
                }
                else if (crit.documents.some(value => value.state == License.getDocStatusById(4,catalogs.docStatus))) {
                    expect(crit.state).toBe(License.getDocStatusById(4,catalogs.docStatus));
                }
                expect(crit.state).toBe(License.getDocStatusById(3,catalogs.docStatus));
                crit.documents.forEach((doc, index2) => {
                    expect(doc.state).toBe(License.getDocStatusById(doc.stateId,catalogs.docStatus));
                })
            })
        })
    })
})