import {Prolicense, TDocuments, TProlicense} from "./prolicense";
import {Catalogs, TClubWorkers, TCriteriaGroups, TCriteriaTypes, TDocTypes, TRankCriteria} from "./catalogs";
import {randomInt} from "crypto";
import {TestData} from "../helpers/test-data";
import superagent from "superagent";
import {Api, TConstructor} from "../helpers/api";

export class Criterias {
    public  criterias : TCriterias[]
    public catalogs = new Catalogs()
    constructor() {
        this.criterias =[]
    }
    public createCritGroups () : void {
        this.catalogs.criteriaGroups.forEach((value) => {
            this.criterias.push(
                {
                id : value.id,
                name : value.name,
                experts : this.catalogs.critGrpExpertsId,
                details : {
                    experts : this.catalogs.critGrpExperts
                },
                criterias : []
            }
            )
        })
    }
    public createCriterias () : void {
        this.criterias.forEach((criteriaGroup) => {
                this.catalogs.criteriaTypes.forEach((criteria) => {
                const randomDocNumber : number = TestData.randomIntForDocs(this.catalogs.docTypesForCrit);
                criteriaGroup.criterias.push(
                    {
                        groupId: criteriaGroup.id,
                        number: TestData.randomWord,
                        categoryId: this.catalogs.rankCriteria[0].id,
                        name: TestData.randomWord,
                        description: TestData.descValue,
                        isMulti: TestData.randomIntForMulti,
                        typeId: this.catalogs.criteriaTypes[0].id,
                        docSubmitDate: TestData.futureDate,
                        reviewDate: TestData.futureDate,
                        documents: [
                            {
                                name: TestData.randomWord,
                                docTypeId: this.catalogs.docTypesForCrit[randomDocNumber].id,
                                templates: (randomDocNumber >= 2 && randomDocNumber !=4) ? [] : TestData.files
                            },
                            {
                                name: TestData.randomWord,
                                docTypeId: this.catalogs.docTypesForCrit[randomDocNumber].id,
                                templates: (randomDocNumber >= 2 && randomDocNumber !=4) ? [] : TestData.files
                            },
                            {
                                name: TestData.randomWord,
                                docTypeId: this.catalogs.docTypesForCrit[randomDocNumber].id,
                                templates: (randomDocNumber >= 2 && randomDocNumber !=4) ? [] : TestData.files
                            }
                        ]
                    }
                )
            }
            )
        }
        )
    }
    public changeCriterias () : void {
        this.criterias.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                const randomDocNumber : number = TestData.randomIntForDocs(this.catalogs.docTypesForCrit);
                criteria.number = TestData.randomWord;
                criteria.name = TestData.randomWord;
                criteria.categoryId = this.catalogs.rankCriteria[1].id;
                criteria.documents.push(
                    {
                    name: TestData.randomWord,
                    docTypeId: this.catalogs.docTypesForCrit[randomDocNumber].id,
                    templates: (randomDocNumber >= 2 && randomDocNumber !=4) ? [] : TestData.files
                }
                )
            })
        })
    }
    public async createTestCriterias (api : Api) : Promise<void> {
        //prolicense : TProlicense[],
        //Создаем группы критериев
        this.createCritGroups();
        for (const i of this.criterias) {
            await superagent.put(api.basicUrl + api.constructors.createCriteriaGrp).
            query({groupId: i.id, experts: i.experts});
        }
        //Создаем критерии
        this.createCriterias();
        for(const criteriaGroup of this.criterias) {
            for(let criteria of criteriaGroup.criterias) {
                const index = criteriaGroup.criterias.indexOf(criteria);
                const response = await superagent.put(api.basicUrl + api.constructors.createCriterias).
                send(criteria);
                criteriaGroup.criterias[index] = response.body.data;
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