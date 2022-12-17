import {jest, test, expect, describe, beforeAll} from "@jest/globals";
import superagent from "superagent";
import {RequestProp} from "./class/RequestProp";
import {TestData, TCurrentSeason, TCriteriaFullInfo, TDocuments} from "./class/TestData";
import {randomInt} from "crypto";




describe("Создание тестовых данных", () => {
    jest.setTimeout(20000);

    test("Загрузка файла на сервер", async () => {

        for (const i of TestData.fileNames) {
            const response = await superagent.post(RequestProp.basicUrl + "/api/rest/uploadFile").
            set("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryoI4AK63JZr8jUhAa").
            attach("file", RequestProp.fileDir + i);

            expect(response.ok).toBeTruthy();
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("SUCCESS");
            expect(response.body.data).toBeDefined();
            TestData.fileInfo.push([i, response.body.data]);
        }

    })
    test("Справочник сезонов", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/seasons");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        TestData.seasons = response.body.data.filter((value: TCurrentSeason, index: number, arr: TCurrentSeason[]) => (value.current || index == arr.length - 1));
    })

    test("Справочник Группы критериев", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/prolicenses/criterias/groups");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        TestData.criteriaGroups = response.body.data;
    })
    test("Справочник Типы лицензий", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/lictypes");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0)
        TestData.licTypes = response.body.data;

    })
    test("Справочник Типы документов", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/doctypes");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        TestData.docTypes = response.body.data;
    })
    test("Разряды для критериев", async () => {
        const response = await superagent.get(RequestProp.basicUrl+"/api/rest/prolicenses/criterias/categories");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        TestData.rankCriteria = response.body.data;
    })
    test("Типы критериев",async () => {
        const response = await superagent.get(RequestProp.basicUrl+"/api/rest/prolicenses/criterias/types");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBeGreaterThan(0);
        TestData.criteriaTypes = response.body.data;
    })
})

describe("Конструктор пролицензий", () => {

    test("Создание проекта лицензии", async () => {
        const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses").send({
                "name": TestData.getRandomWord(),
                "season": TestData.seasons[0].name,
                "type": TestData.licTypes[0].name,
                "requestBegin": TestData.dateNow,
                "requestEnd": TestData.dateFuture,
                "dueDate": TestData.dateFuture,
                "docSubmitDate": TestData.dateFuture,
                "reviewDate": TestData.dateFuture,
                "decisionDate": TestData.dateFuture,
                "begin": TestData.dateNow,
                "end": TestData.dateFuture,
                "documents": [
                    {
                        "name": TestData.getRandomWord(),
                        "docTypeId": TestData.docTypes[0].id,
                        "templates": [
                            {
                                "name": TestData.fileInfo[0][0],
                                "storageId": TestData.fileInfo[0][1]
                            },
                            {
                                "name": TestData.fileInfo[1][0],
                                "storageId": TestData.fileInfo[1][1]
                            },
                            {
                                "name": TestData.fileInfo[2][0],
                                "storageId": TestData.fileInfo[2][1]
                            }
                        ]
                    }
                ]
            }
        )
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.type).toBe(TestData.licTypes[0].name);
        expect(response.body.data.season).toBe(TestData.seasons[0].name);
        expect(response.body.data.stateId).toBe(1);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.dateNow);
        expect(response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate).toBe(TestData.dateFuture);

        TestData.prolicense.push(response.body.data);
    })

    test("Изменение проекта лицензии", async () => {
        const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses/" + TestData.prolicense[0].id).send({
            "id": TestData.prolicense[0].id,
            "type": TestData.licTypes[1].name,
            "season": TestData.seasons[1].name,
            "name": TestData.getRandomWord(),
            "begin": TestData.dateNow,
            "end": TestData.dateFuture,
            "requestBegin": TestData.dateNow,
            "requestEnd": TestData.dateFuture,
            "docSubmitDate": TestData.dateFuture,
            "dueDate": TestData.dateFuture,
            "reviewDate": TestData.dateFuture,
            "decisionDate": TestData.dateFuture,
            "stateId": TestData.prolicense[0].stateId,
            "documents": [
                TestData.prolicense[0].documents[0],
                {
                    "name": TestData.getRandomWord(),
                    "docTypeId": TestData.docTypes[0].id,
                    "templates": [
                        {
                            "name": TestData.fileInfo[2][0],
                            "storageId": TestData.fileInfo[2][1]
                        },
                        {
                            "name": TestData.fileInfo[1][0],
                            "storageId": TestData.fileInfo[1][1]
                        },
                        {
                            "name": TestData.fileInfo[0][0],
                            "storageId": TestData.fileInfo[0][1]
                        }
                    ]
                }
            ]
        })
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data).toEqual({});
    })
    test("Получение проекта лицензии по ID", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/prolicenses/" + TestData.prolicense[0].id);
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).toBe(TestData.prolicense[0].id);
        expect(response.body.data.type).not.toBe(TestData.prolicense[0].type);
        expect(response.body.data.season).not.toBe(TestData.prolicense[0].season);
        expect(response.body.data.name).not.toBe(TestData.prolicense[0].name);
        expect(response.body.data.documents.length).toBe(2);
        TestData.prolicense[0] = response.body.data;
    })
    test("Создание группы критериев пролицензии", async () => {
        for (const i of TestData.criteriaGroups) {
            const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses/" + TestData.prolicense[0].id + "/criterias/groupExperts").query(
                {
                    groupId: i.id,
                    experts: [0, 1, 2]
                }
            );
            expect(response.ok).toBeTruthy();
            expect(response.status).toBe(200);
            expect(response.body.status).toBe("SUCCESS");
            expect(response.body.data).toEqual({});
            TestData.criteriasFullInfo.push(
                {
                    id: i.id,
                    name: i.name,
                    experts: [0, 1, 2],
                    criterias: []
                }
            )
        }
    })
    test("Создание критерия пролицензии", async () => {
        for (const i of TestData.criteriasFullInfo) {
            for (const n of TestData.criteriaTypes) {
                const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses/" + TestData.prolicense[0].id + "/criterias").
                send({
                        "groupId": i.id,
                        "number": String(randomInt(1, 1000)),
                        "categoryId": TestData.rankCriteria[randomInt(0, TestData.rankCriteria.length - 1)].id,
                        "name": TestData.getRandomWord(),
                        "description": TestData.getRandomWord(),
                        "isMulti": randomInt(-1, 5),
                        "typeId": n.id,
                        "docSubmitDate": TestData.dateFuture,
                        "reviewDate": TestData.dateFuture,
                        "documents": [
                            {
                                "name": TestData.getRandomWord(),
                                "docTypeId": TestData.docTypes[randomInt(0, TestData.docTypes.length - 1)].id,
                                "templates": [
                                    {
                                        "name": TestData.fileInfo[0][0],
                                        "storageId": TestData.fileInfo[0][1]
                                    },
                                    {
                                        "name": TestData.fileInfo[1][0],
                                        "storageId": TestData.fileInfo[1][1]
                                    },
                                    {
                                        "name": TestData.fileInfo[2][0],
                                        "storageId": TestData.fileInfo[2][1]
                                    }
                                ]
                            },
                            {
                                "name": TestData.getRandomWord(),
                                "docTypeId": TestData.docTypes[randomInt(0, TestData.docTypes.length - 1)].id,
                                "templates": [
                                    {
                                        "name": TestData.fileInfo[2][0],
                                        "storageId": TestData.fileInfo[2][1]
                                    },
                                    {
                                        "name": TestData.fileInfo[1][0],
                                        "storageId": TestData.fileInfo[1][1]
                                    },
                                    {
                                        "name": TestData.fileInfo[0][0],
                                        "storageId": TestData.fileInfo[0][1]
                                    }
                                ]
                            }
                        ]
                    }
                )
                expect(response.ok).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                expect(response.body.data.groupId).toBe(i.id);
                expect(response.body.data.docSubmitDate && response.body.data.reviewDate).toBe(TestData.dateFuture);
                i.criterias.push(response.body.data);
            }
        }
    })
    test("Изменение критериев пролицензии", async () => {
        for (const i of TestData.criteriasFullInfo) {
            for (const n of i.criterias) {
                const response = await superagent.put(RequestProp.basicUrl + '/api/rest/prolicenses/criterias/' + n.id).send({
                        "groupId": i.id,
                        "number": String(randomInt(1, 1000)),
                        "categoryId": TestData.rankCriteria[randomInt(0, TestData.rankCriteria.length - 1)].id,
                        "name": TestData.getRandomWord(),
                        "description": TestData.getRandomWord(),
                        "isMulti": randomInt(-1, 5),
                        "typeId": TestData.criteriaTypes[randomInt(0, TestData.criteriaTypes.length - 1)].id,
                        "docSubmitDate": TestData.dateFuture,
                        "reviewDate": TestData.dateFuture,
                        "documents": [
                            n.documents[0],
                            n.documents[1],
                            {
                                "name": TestData.getRandomWord(),
                                "docTypeId": TestData.docTypes[randomInt(0, TestData.docTypes.length - 1)].id,
                                "templates": [
                                    {
                                        "name": TestData.fileInfo[2][0],
                                        "storageId": TestData.fileInfo[2][1]
                                    },
                                    {
                                        "name": TestData.fileInfo[1][0],
                                        "storageId": TestData.fileInfo[1][1]
                                    },
                                    {
                                        "name": TestData.fileInfo[0][0],
                                        "storageId": TestData.fileInfo[0][1]
                                    }
                                ]
                            }
                        ]
                    }
                )
                expect(response.ok).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                expect(response.body.data).toEqual({});
            }
        }
    })
    test("Получение полной информации о критериях пролицензии", async () => {
        const response = await superagent.get(RequestProp.basicUrl + "/api/rest/prolicenses/" + TestData.prolicense[0].id + "/criterias");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.groups.length).toBeGreaterThan(0);
        expect(response.body.data.groups.every((value: TCriteriaFullInfo) => value.criterias.length == TestData.criteriaTypes.length)).toBeTruthy();
        response.body.data.groups.forEach((value: TCriteriaFullInfo, index: number) => {
            expect(value.criterias).not.toBe(TestData.criteriasFullInfo[index].criterias);
            TestData.criteriasFullInfo[index].criterias = value.criterias;
        })
    })
    test("Создание пролицензии по образцу", async () => {
        const response = await superagent.put(RequestProp.basicUrl + "/api/rest/prolicenses/clone/" + TestData.prolicense[0].id).send({
                "type": TestData.licTypes[randomInt(0, TestData.licTypes.length - 1)].name,
                "season": TestData.seasons[0].name,
                "name": TestData.getRandomWord()
            }
        )
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data.id).not.toBe(TestData.prolicense[0].id);
        expect(
            response.body.data.end && response.body.data.requestEnd &&
            response.body.data.docSubmitDate && response.body.data.dueDate &&
            response.body.data.reviewDate && response.body.data.decisionDate
        ).toBe(TestData.dateFuture);
        expect(response.body.data.begin && response.body.data.requestBegin).toBe(TestData.dateNow);
        expect(response.body.data.stateId).toBe(1);

        response.body.data.documents.forEach((value : TDocuments, index : number) =>{
        expect(value.name).toBe(TestData.prolicense[0].documents[index].name);
        value.templates.forEach((value1, index1) => {
            expect(value1.name).toBe(TestData.prolicense[0].documents[index].templates[index1].name);
            expect(value1.storageId).toBe(TestData.prolicense[0].documents[index].templates[index1].storageId);
        })
    })
        TestData.prolicense.push(response.body.data);

    })
    test("Удаление пролицензии", async () => {
        const response = await superagent.delete(RequestProp.basicUrl + "/api/rest/prolicenses/" + TestData.prolicense[1].id);
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        TestData.prolicense.pop();
        expect(TestData.prolicense.length).toBe(1);
    })
    test("Удаление критерия пролицензии", async () => {
        for (const i of TestData.criteriasFullInfo) {
            if (i.id % 2 == 0) {
                for (const n of i.criterias) {
                    const response = await superagent.delete(RequestProp.basicUrl + "/api/rest/prolicenses/criterias/" + n.id);
                    expect(response.ok).toBeTruthy();
                    expect(response.status).toBe(200);
                    expect(response.body.status).toBe("SUCCESS");
                }
                i.criterias = [];
            }
        }
    })
    test("Удаление группы критериев", async () => {
        for (let i = 0; i<TestData.criteriasFullInfo.length; i++) {
            if (TestData.criteriasFullInfo[i].id % 2 == 0) {
                const response = await superagent.delete(RequestProp.basicUrl + "/api/rest/prolicenses/" +
                    TestData.prolicense[0].id + "/criterias/groups/" + TestData.criteriasFullInfo[i].id);
                expect(response.ok).toBeTruthy();
                expect(response.status).toBe(200);
                expect(response.body.status).toBe("SUCCESS");
                TestData.criteriasFullInfo.splice(i,1);
            }
        }
    })
    test("Публикация проекта лицензии",async () => {
        const response = await superagent.put(RequestProp.basicUrl+"/api/rest/prolicenses/"+TestData.prolicense[0].id+"/publish");
        expect(response.ok).toBeTruthy();
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("SUCCESS");
        expect(response.body.data).toEqual({});
        TestData.prolicense[0].stateId = 2;

    })
})