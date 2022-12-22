import {jest, test, expect, describe, beforeAll} from "@jest/globals";
import superagent from "superagent";
import {RequestProp} from "../class/request-prop";
import {TestData} from "../class/test-data";
import {Catalogs,TCurrentSeason} from "../class/catalogs";
import {Prolicense, TDocuments} from "../class/prolicense";
import {License} from "../class/license";
import {Criterias, TCriterias} from "../class/criterias";
import {randomInt} from "crypto";

describe("Получение данных из справочников", () => {
    jest.setTimeout(20000);

    test("Загрузка файла на сервер", async () => {
        for (const i of TestData.fileNames) {
            const response = await superagent.post(RequestProp.basicUrl + "/api/rest/uploadFile").
            set("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryoI4AK63JZr8jUhAa").
            attach("file", RequestProp.fileDir + i);
            //Проверяем статус ответа и наличие возвращаемого значения в data
            expect(response.ok).toBeTruthy();
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("SUCCESS");
            expect(response.body.data).toBeDefined();
            //Записываем полученные id  и наименования файлов в свойство files
            TestData.addDataToFiles(i,response.body.data);
        }
    })
    test("Справочник сезонов", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/seasons");
        //проверяем статус ответа и длинну массива data
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        //Записываем полученные значения текущего сезона и последнего сезона справочника в свойство seasons
        Catalogs.seasons = response.body.data.filter((value: TCurrentSeason, index: number, arr: TCurrentSeason[]) => (value.current || index == arr.length - 1));
    })

    test("Справочник Группы критериев", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/prolicenses/criterias/groups");
        //проверяем статус ответа и длинну массива data
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        Catalogs.criteriaGroups = response.body.data;
    })
    test("Справочник Типы лицензий", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/lictypes");
        //проверяем статус ответа и длинну массива data
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0)
        Catalogs.licTypes = response.body.data;

    })
    test("Справочник Типы документов", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/doctypes");
        //проверяем статус ответа и длинну массива data
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        Catalogs.docTypes = response.body.data;
    })
    test("Разряды для критериев", async () => {
        const response = await superagent.get(RequestProp.basicUrl+"/api/rest/prolicenses/criterias/categories");
        //проверяем статус ответа и длинну массива data
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        Catalogs.rankCriteria = response.body.data;
    })
    test("Типы критериев",async () => {
        const response = await superagent.get(RequestProp.basicUrl+"/api/rest/prolicenses/criterias/types");
        //проверяем статус ответа и длинну массива data
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        Catalogs.criteriaTypes = response.body.data;
    })
    test("Возможные статусы заявки",async () => {
        const response = await superagent.get(RequestProp.basicUrl+"/api/rest/licenses/states");
        //проверяем статус ответа и длинну массива data
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        //Записываем полученные значения справочника в свойство licStatus
        Catalogs.licStatus = response.body.data
    })
    test("Возможные статусы документов",async () => {
        const response = await superagent.get(RequestProp.basicUrl+"/api/rest/licenses/docstates");
        //проверяем статус ответа и длинну массива data
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        //Записываем полученные значения справочника в свойство docStatus
        Catalogs.docStatus = response.body.data;
    })
    test("Сотрудники клуба",async () => {
        const response = await superagent.get(RequestProp.basicUrl+"/api/rest/persons/findbyparams").
        query(
            {
              pageNum : 0,
              pageSize : 10
            }
            )
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(10);
        Catalogs.clubWorkers = response.body.data;
    })
    test("Эксперты групп критериев",async () => {
        const response = await superagent.get(RequestProp.basicUrl+"/api/rest/persons/withRights").
        query(
            {
                rights : "request.checkExpert"
            }
        )
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        Catalogs.critGrpExperts = response.body.data;
    })
})

describe("Пролицензия", () => {

    test("Создание проекта лицензии", async () => {
        Prolicense.createProlicense();
        const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses").
        send(Prolicense.getProlicense(0));
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.type).toBe(Catalogs.licTypes[0].name);
        expect(response.body.data.season).toBe(Catalogs.seasons[0].name);
        expect(response.body.data.stateId).toBe(1);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.dateNow);
        expect(response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate).toBe(TestData.dateFuture);

        Prolicense.addResponseToProlicense(0,response.body.data);
    })

    test("Изменение проекта лицензии", async () => {
        //Меняем наименование, тип , сезон пролицензии и добавляем второй документ
        Prolicense.changeProlicense();
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
        Criterias.createCritGroups();
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
        Criterias.createCriterias();
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
        Criterias.changeCriterias();
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
        expect(response.body.data.groups.every((value: TCriterias) => value.criterias.length == Catalogs.criteriaTypes.length)).toBeTruthy();
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
        send(Prolicense.createSampleProlicense());
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
    test("Создание заявки в статусе 'Черновик' ",async () => {
        const response = await superagent.put(RequestProp.basicUrl+"/api/rest/licenses").
        send(License.createLicense());
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.proLicId).toBe(Prolicense.prolicense[0].id);
        expect(response.body.data.state).toBe(License.getLicStatusById(response.body.data.stateId));
        expect(response.body.data.percent).toBe(0);
        expect(response.body.data.docState).toBe(License.getDocStatusById(response.body.data.docStateId));
        License.addResponseToLicense(0,response.body.data);
        //Проверяем статусы документов лицензии
        License.license[0].documents.forEach((value, index) => {
            expect(value.state).toBe(License.getDocStatusById(response.body.data.docStateId));
            expect(value.proDocId).toBe(Prolicense.prolicense[0].documents[index].id);
        })
        //Проверяем статусы и проценты заполнения групп критериев
        License.license[0].criteriaGroups.forEach((value, index) => {
            expect(value.groupId).toBe(Criterias.criterias[index].id);
            expect(value.state).toBe(License.getDocStatusById(value.stateId));
            expect(value.percent).toBe(0.0);
            //Проверяем статусы и проценты заполнения критериев
            value.criterias.forEach((value1, index1) => {
                expect(value1.state).toBe(License.getDocStatusById(value1.stateId));
                expect(value1.percent).toBe(0.0);
                //Проверяем статусы документов критериев
                value1.documents.forEach(value2 => {
                    expect(value2.state).toBe(License.getDocStatusById(value2.stateId));
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
            send(License.addClubWorkersToCritGrp());
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
        send(License.addStatusToDocuments());
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        License.addResponseToLicense(0,response.body.data);
        console.log(License.license[0].id)
        //Проверяем проценты заполнения и статусы заявки, групп критериев, критериев
        License.license[0].criteriaGroups.forEach((grp, index) => {
            const grpPercent = grp.criterias.reduce((accum,value) =>accum+value.percent,0)/grp.criterias.length;
            expect(Math.round(grp.percent)).toBe(Math.round(grpPercent));
            if(grp.criterias.some(value => value.state == License.getDocStatusById(5))) {
                expect(grp.state).toBe(License.getDocStatusById(5));
            }
            else if (grp.criterias.some(value => value.state == License.getDocStatusById(2))) {
                expect(grp.state).toBe(License.getDocStatusById(2));
            }
            else if (grp.criterias.some(value => value.state == License.getDocStatusById(4))) {
                expect(grp.state).toBe(License.getDocStatusById(4));
            }
            expect(grp.state).toBe(License.getDocStatusById(3));
            grp.criterias.forEach((crit, index1) => {
                const critPercent = crit.documents.filter(value => value.stateId != 2).length*100/crit.documents.length;
                expect(Math.round(crit.percent)).toBe(Math.round(critPercent));
                if(crit.documents.some(value => value.state == License.getDocStatusById(5))) {
                    expect(crit.state).toBe(License.getDocStatusById(5));
                }
                else if (crit.documents.some(value => value.state == License.getDocStatusById(2))) {
                    expect(crit.state).toBe(License.getDocStatusById(2));
                }
                else if (crit.documents.some(value => value.state == License.getDocStatusById(4))) {
                    expect(crit.state).toBe(License.getDocStatusById(4));
                }
                    expect(crit.state).toBe(License.getDocStatusById(3));
                crit.documents.forEach((doc, index2) => {
                    expect(doc.state).toBe(License.getDocStatusById(doc.stateId));
                })
            })
        })
    })
})