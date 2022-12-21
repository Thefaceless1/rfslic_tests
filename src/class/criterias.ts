import {TDocuments} from "./prolicense";
import {Catalogs, TCriteriaTypes} from "./catalogs";
import {randomInt} from "crypto";
import {TestData} from "./test-data";

export class Criterias {
    public static criterias : TCriterias[] =[];
    public static createCritGroups () : void {
        Catalogs.criteriaGroups.forEach((value, index) => {
            this.criterias.push(
                {
                id : value.id,
                name : value.name,
                experts : [0, 1, 2],
                criterias : []
            }
            )
        })
    }
    public static createCriterias () : void {
        this.criterias.forEach((value, index) => {
            Catalogs.criteriaTypes.forEach((value1, index1) => {
                value.criterias.push(
                    {
                        groupId: value.id,
                        number: TestData.getRandomWord(),
                        categoryId: Catalogs.rankCriteria[0].id,
                        name: TestData.getRandomWord(),
                        description: TestData.descValue,
                        isMulti: randomInt(-1, 5),
                        typeId: value1.id,
                        docSubmitDate: TestData.dateFuture,
                        reviewDate: TestData.dateFuture,
                        documents: [
                            {
                                name: TestData.getRandomWord(),
                                docTypeId: Catalogs.docTypes[0].id,
                                templates: [
                                    {
                                        name: TestData.fileInfo[0][0],
                                        storageId: TestData.fileInfo[0][1]
                                    },
                                    {
                                        name: TestData.fileInfo[1][0],
                                        storageId: TestData.fileInfo[1][1]
                                    },
                                    {
                                        name: TestData.fileInfo[2][0],
                                        storageId: TestData.fileInfo[2][1]
                                    }
                                ]
                            },
                            {
                                name: TestData.getRandomWord(),
                                docTypeId: Catalogs.docTypes[0].id,
                                templates: [
                                    {
                                        name: TestData.fileInfo[2][0],
                                        storageId: TestData.fileInfo[2][1]
                                    },
                                    {
                                        name: TestData.fileInfo[1][0],
                                        storageId: TestData.fileInfo[1][1]
                                    },
                                    {
                                        name: TestData.fileInfo[0][0],
                                        storageId: TestData.fileInfo[0][1]
                                    }
                                ]
                            }
                        ]
                    }
                )
            }
            )
        }
        )
    }
    public static changeCriterias () : void {
        this.criterias.forEach((value, index) => {
            value.criterias.forEach((value1, index1) => {
                value1.number = TestData.getRandomWord();
                value1.name = TestData.getRandomWord();
                value1.categoryId = Catalogs.rankCriteria[Catalogs.rankCriteria.length-1].id;
                value1.documents.push(
                    {
                    name: TestData.getRandomWord(),
                    docTypeId: Catalogs.docTypes[randomInt(0, Catalogs.docTypes.length - 1)].id,
                    templates: [
                    {
                        name: TestData.fileInfo[2][0],
                        storageId: TestData.fileInfo[2][1]
                    },
                    {
                        name: TestData.fileInfo[1][0],
                        storageId: TestData.fileInfo[1][1]
                    },
                    {
                        name: TestData.fileInfo[0][0],
                        storageId: TestData.fileInfo[0][1]
                    }
                ]
                }
                )
            })
        })
    }
}

export type TCriterias = {
    id: number,
    name : string,
    experts : number[],
    criterias : {
        id?: number,
        groupId: number,
        number: string,
        categoryId: number,
        name: string,
        description?: string,
        docSubmitDate: string,
        reviewDate: string,
        isMulti: number,
        typeId: number,
        documents: TDocuments[]
    }[]
}