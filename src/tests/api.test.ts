import {jest, test, expect, describe, beforeAll} from "@jest/globals";
import superagent from "superagent";
import {RequestProp} from "../class/request-prop";
import {TestData} from "../class/test-data";
import {Catalogs,TCurrentSeason} from "../class/catalogs";
import {Prolicense, TDocuments} from "../class/prolicense";
import {License} from "../class/license";
import {Criterias, TCriterias} from "../class/criterias";
jest.setTimeout(60000);

describe("Пролицензия", () => {
    const catalogs = new Catalogs();
    beforeAll(async () => {
    await catalogs.fillCatalogsData()
})
    test("Создание проекта лицензии", async () => {
        Prolicense.createProlicense(catalogs.seasons,catalogs.licTypes,catalogs.docTypes);
        const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses").
        send(Prolicense.getProlicense(0));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.type).toBe(catalogs.licTypes[0].name);
        expect(response.body.data.season).toBe(catalogs.seasons[0].name);
        expect(response.body.data.stateId).toBe(1);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.dateNow);
        expect(response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate).toBe(TestData.dateFuture);

        Prolicense.addResponseToProlicense(0,response.body.data);
    })

    test("Изменение проекта лицензии", async () => {
        //Меняем наименование, тип , сезон пролицензии и добавляем второй документ
        Prolicense.changeProlicense(catalogs.seasons,catalogs.licTypes,catalogs.docTypes);
        const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses/" + Prolicense.getProlicense(0).id).
        send(Prolicense.getProlicense(0));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data).toEqual({});
    })
    test("Получение проекта лицензии по ID", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/prolicenses/" + Prolicense.getProlicense(0).id);
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).toBe(Prolicense.getProlicense(0).id);
        expect(response.body.data.type).toBe(Prolicense.getProlicense(0).type);
        expect(response.body.data.season).toBe(Prolicense.getProlicense(0).season);
        expect(response.body.data.name).toBe(Prolicense.getProlicense(0).name);
        expect(response.body.data.documents.length).toBe(Prolicense.getProlicense(0).documents.length);
        Prolicense.addResponseToProlicense(0,response.body.data);
    })
    test("Создание группы критериев пролицензии", async () => {
        Criterias.createCritGroups(catalogs.criteriaGroups,catalogs.critGrpExperts);
        for (const i of Criterias.criterias) {
            const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses/" + Prolicense.getProlicense(0).id + "/criterias/groupExperts").
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
        Criterias.createCriterias(catalogs.criteriaTypes,catalogs.rankCriteria,catalogs.docTypes);
        for(const i of Criterias.criterias){
            for(let criteria of i.criterias) {
                const index = i.criterias.indexOf(criteria);
                const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses/" + Prolicense.getProlicense(0).id + "/criterias").
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
        Criterias.changeCriterias(catalogs.rankCriteria,catalogs.docTypes);
        for (const i of Criterias.criterias) {
            for (const criteria of i.criterias) {
                const response = await superagent.put(RequestProp.basicUrl + '/api/rest/prolicenses/criterias/' + criteria.id).
                send(criteria)
                expect(response.ok).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                expect(response.body.data).toEqual({});
            }
        }
    })
    test("Получение полной информации о критериях пролицензии", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/prolicenses/" + Prolicense.getProlicense(0).id + "/criterias");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.groups.length).toBeGreaterThan(0);
        expect(response.body.data.groups.every((value: TCriterias) => value.criterias.length == catalogs.criteriaTypes.length)).toBeTruthy();
        response.body.data.groups.forEach((value: TCriterias, index: number) => {
            value.criterias.forEach((value1, index1) => {
                expect(value1.name).toBe(Criterias.criterias[index].criterias[index1].name);
                expect(value1.number).toBe(Criterias.criterias[index].criterias[index1].number);
                expect(value1.categoryId).toBe(Criterias.criterias[index].criterias[index1].categoryId);
                expect(value1.documents).not.toEqual(Criterias.criterias[index].criterias[index1].documents);
                value1.documents = Criterias.criterias[index].criterias[index1].documents;
            })
        })
    })
    test("Создание пролицензии по образцу", async () => {
        const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses/clone/" + Prolicense.getProlicense(0).id).
        send(Prolicense.createSampleProlicense(catalogs.seasons,catalogs.licTypes));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).not.toBe(Prolicense.getProlicense(0).id);
        expect(
            response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate
        ).toBe(TestData.dateFuture);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.dateNow);
        expect(response.body.data.stateId).toBe(1);
        response.body.data.documents.forEach((value : TDocuments, index : number) =>{
        expect(value.name).toBe(Prolicense.prolicense[0].documents[index].name);
        value.templates.forEach((value1, index1) => {
            expect(value1.name).toBe(Prolicense.prolicense[0].documents[index].templates[index1].name);
            expect(value1.storageId).toBe(Prolicense.prolicense[0].documents[index].templates[index1].storageId);
        })
    })
        Prolicense.prolicense.push(response.body.data)
    })
    test("Удаление пролицензии", async () => {
        const response = await superagent.delete(RequestProp.basicUrl + "/api/rest/prolicenses/" + Prolicense.getProlicense(1).id);
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        Prolicense.prolicense.pop();
    })
    test("Удаление критерия пролицензии", async () => {
        for (const i of Criterias.criterias) {
            if (i.id % 2 == 0) {
                for (const criteria of i.criterias) {
                    const response = await superagent.delete(RequestProp.basicUrl + "/api/rest/prolicenses/criterias/" + criteria.id);
                    expect(response.ok).toBeTruthy();
                    expect(response.status).toBe(200);
                    expect(response.body.status).toBe("SUCCESS");
                }
                i.criterias = [];
            }
        }
    })
    test("Удаление группы критериев", async () => {
        for (let i = 0; i<Criterias.criterias.length; i++) {
            if (Criterias.criterias[i].id % 2 == 0) {
                const response = await superagent.delete(RequestProp.basicUrl + "/api/rest/prolicenses/" +
                    Prolicense.getProlicense(0).id + "/criterias/groups/" + Criterias.criterias[i].id);
                expect(response.ok).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                Criterias.criterias.splice(i,1);
            }
        }
    })
    test("Публикация проекта лицензии",async () => {
        const response = await superagent.put(RequestProp.basicUrl+"/api/rest/prolicenses/"+Prolicense.getProlicense(0).id+"/publish");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data).toEqual({});
        Prolicense.prolicense[0].stateId = 2;
    })
})

describe("Работа с заявками", () => {
    const catalogs = new Catalogs();
    beforeAll(async () => {
        await catalogs.fillCatalogsData()
        })
    test("Создание заявки в статусе 'Черновик' ",async () => {
        const response = await superagent.put(RequestProp.basicUrl+"/api/rest/licenses").
        send(License.createLicense());
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.proLicId).toBe(Prolicense.prolicense[0].id);
        expect(response.body.data.state).toBe(License.getLicStatusById(response.body.data.stateId,catalogs.licStatus));
        expect(response.body.data.percent).toBe(0);
        expect(response.body.data.docState).toBe(License.getDocStatusById(response.body.data.docStateId,catalogs.docStatus));
        License.addResponseToLicense(0,response.body.data);
        //Проверяем статусы документов лицензии
        License.license[0].documents.forEach((value, index) => {
            expect(value.state).toBe(License.getDocStatusById(response.body.data.docStateId,catalogs.docStatus));
            expect(value.proDocId).toBe(Prolicense.prolicense[0].documents[index].id);
        })
        //Проверяем статусы и проценты заполнения групп критериев
        License.license[0].criteriaGroups.forEach((value, index) => {
            expect(value.groupId).toBe(Criterias.criterias[index].id);
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
    test("Добавление документов и комментариев к документам вкладки 'Общая информация' ",async () => {
        const response = await superagent.put(RequestProp.basicUrl+"/api/rest/licenses/"+License.license[0].id).
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
    test("Добавление сотрудников клуба и экспертов к группе критериев", async () => {
            const response = await superagent.put(RequestProp.basicUrl+"/api/rest/licenses/"+License.license[0].id).
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
        const response = await superagent.put(RequestProp.basicUrl+"/api/rest/licenses/"+License.license[0].id).
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
        const response = await superagent.put(RequestProp.basicUrl+"/api/rest/licenses/"+License.license[0].id).
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