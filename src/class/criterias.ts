import {TDocuments} from "./prolicense";
import {Catalogs, TClubWorkers, TCriteriaGroups, TCriteriaTypes, TDocTypes, TRankCriteria} from "./catalogs";
import {randomInt} from "crypto";
import {TestData} from "./test-data";

export class Criterias {
    public static criterias : TCriterias[] =[];
    public static createCritGroups (critGroups : TCriteriaGroups[],critGrpExperts : TClubWorkers[] ) : void {
        critGroups.forEach((value, index) => {
            this.criterias.push(
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
    public static createCriterias (criteriaTypes : TCriteriaTypes[],rankCriteria : TRankCriteria[],docTypes : TDocTypes[]) : void {
        this.criterias.forEach((value, index) => {
                criteriaTypes.forEach((value1, index1) => {
                value.criterias.push(
                    {
                        groupId: value.id,
                        number: TestData.getRandomWord(),
                        categoryId: rankCriteria[0].id,
                        name: TestData.getRandomWord(),
                        description: TestData.descValue,
                        isMulti: randomInt(-1, 5),
                        typeId: value1.id,
                        docSubmitDate: TestData.dateFuture,
                        reviewDate: TestData.dateFuture,
                        documents: [
                            {
                                name: TestData.getRandomWord(),
                                docTypeId: docTypes[0].id,
                                templates: TestData.files
                            },
                            {
                                name: TestData.getRandomWord(),
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
    public static changeCriterias (rankCriteria : TRankCriteria[],docTypes : TDocTypes[]) : void {
        this.criterias.forEach((value, index) => {
            value.criterias.forEach((value1, index1) => {
                value1.number = TestData.getRandomWord();
                value1.name = TestData.getRandomWord();
                value1.categoryId = rankCriteria[rankCriteria.length-1].id;
                value1.documents.push(
                    {
                    name: TestData.getRandomWord(),
                    docTypeId: docTypes[randomInt(0, docTypes.length - 1)].id,
                    templates: TestData.files
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
    details : {
        experts : TClubWorkers[]
    }
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