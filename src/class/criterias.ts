import {Prolicense, TDocuments, TProlicense} from "./prolicense";
import {Catalogs, TClubWorkers, TCriteriaGroups, TCriteriaTypes, TDocTypes, TRankCriteria} from "./catalogs";
import {randomInt} from "crypto";
import {TestData} from "../helpers/test-data";
import superagent from "superagent";
import {RequestProp, TConstructor} from "../helpers/request-prop";
import {expect} from "@jest/globals";

export class Criterias {
    public  criterias : TCriterias[];
    constructor() {
        this.criterias =[]
    }
    public static createCritGroups (criterias : TCriterias[],critGroups : TCriteriaGroups[],critGrpExperts : TClubWorkers[] ) : void {
        critGroups.forEach((value, index) => {
            criterias.push(
                {
                id : value.id,
                name : value.name,
                experts : Catalogs.getCritGrpExpertsId(critGrpExperts),
                details : {
                    experts : critGrpExperts
                },
                criterias : []
            }
            )
        })
    }
    public static createCriterias (criterias : TCriterias[],criteriaTypes : TCriteriaTypes[],rankCriteria : TRankCriteria[],docTypes : TDocTypes[]) : void {
        criterias.forEach((value, index) => {
                criteriaTypes.forEach((value1, index1) => {
                value.criterias.push(
                    {
                        groupId: value.id,
                        number: TestData.getRandomWord,
                        categoryId: rankCriteria[0].id,
                        name: TestData.getRandomWord,
                        description: TestData.descValue,
                        isMulti: TestData.getRandomIntForMulti,
                        typeId: value1.id,
                        docSubmitDate: TestData.getFutureDate,
                        reviewDate: TestData.getFutureDate,
                        documents: [
                            {
                                name: TestData.getRandomWord,
                                docTypeId: docTypes[0].id,
                                templates: TestData.files
                            },
                            {
                                name: TestData.getRandomWord,
                                docTypeId: docTypes[0].id,
                                templates: TestData.files
                            }
                        ]
                    }
                )
            }
            )
        }
        )
    }
    public static changeCriterias (criterias : TCriterias[],rankCriteria : TRankCriteria[],docTypes : TDocTypes[]) : void {
        criterias.forEach((value, index) => {
            value.criterias.forEach((value1, index1) => {
                value1.number = TestData.getRandomWord;
                value1.name = TestData.getRandomWord;
                value1.categoryId = rankCriteria[rankCriteria.length-1].id;
                value1.documents.push(
                    {
                    name: TestData.getRandomWord,
                    docTypeId: docTypes[randomInt(0, docTypes.length - 1)].id,
                    templates: TestData.files
                }
                )
            })
        })
    }
    public static async createTestCriterias (criterias : TCriterias[],prolicense : TProlicense[],
                                             critGroups : TCriteriaGroups[],criGrpExperts : TClubWorkers[],
                                             criteriaTypes : TCriteriaTypes[], rankCriteria : TRankCriteria[],
                                             docTypes : TDocTypes[], api : TConstructor) : Promise<void> {
        //Создаем группы критериев
        Criterias.createCritGroups(criterias,critGroups,criGrpExperts);
        for (const i of criterias) {
            const response = await superagent.put(RequestProp.basicUrl + api.createCriteriaGrp).
            query(
                {
                    groupId: i.id,
                    experts: i.experts
                }
            );
        }
        //Создаем критерии
        //"/api/rest/prolicenses/" + Prolicense.getProlicense(prolicense,0).id + "/criterias"
        Criterias.createCriterias(criterias,criteriaTypes,rankCriteria,docTypes);
        for(const i of criterias) {
            for(let criteria of i.criterias) {
                const index = i.criterias.indexOf(criteria);
                const response = await superagent.put(RequestProp.basicUrl + api.createCriterias).
                send(criteria);
                i.criterias[index] = response.body.data;
            }
        }
    }
}

export type TCriterias = {
    id: number,
    name : string,
    experts : number[],
    details : {
        experts : TClubWorkers[]
    }
    criterias : TCriteria[]
}
export type TCriteria = {
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
}