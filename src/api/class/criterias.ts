import {TDocuments} from "./prolicense";
import {Catalogs, TClubWorkers} from "./catalogs";
import {TestData} from "../helpers/test-data";
import superagent from "superagent";
import {Api} from "../helpers/api";

export class Criterias {
    public  criterias : TCriterias[]
    public catalogs = new Catalogs()
    constructor() {
        this.criterias =[]
    }
    /**
     * Создание групп критериев
     */
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
    /**
     * Создание критериев и документов критериев
     */
    public createCriterias () : void {
        this.criterias.forEach((criteriaGroup) => {
            this.catalogs.criteriaTypes.forEach((criteriaType,index) => {
                const randomDocNumber : number = TestData.randomIntForDocs(this.catalogs.docTypesForCrit(criteriaType));
                const docArray : TDocuments[] = [...new Array(3)].fill({
                        name: TestData.randomWord,
                        description : TestData.descValue,
                        docTypeId: this.catalogs.docTypesForCrit(criteriaType)[randomDocNumber].id,
                        templates: (randomDocNumber != 5 && randomDocNumber != 6 && randomDocNumber != 9) ? TestData.files : []
                    })
                criteriaGroup.criterias.push(
                    {
                        groupId: criteriaGroup.id,
                        number: TestData.randomWord,
                        categoryId: this.catalogs.rankCriteria[0].id,
                        name: TestData.randomWord,
                        description: TestData.descValue,
                        isMulti: (criteriaType.name == "Документы") ? null : TestData.randomIntForMulti,
                        typeId: this.catalogs.criteriaTypes[index].id,
                        docSubmitDate: TestData.futureDate,
                        reviewDate: TestData.futureDate,
                        documents: docArray
                    }
                )
            })
        }
        )
    }
    /**
     * Изменение критериев:
     * 1. Номер критерия
     * 2. Наименование
     * 3. Разряд
     */
    public changeCriterias () : void {
        this.criterias.forEach((criteriaGroup) => {
            criteriaGroup.criterias.forEach((criteria) => {
                criteria.number = TestData.randomWord;
                criteria.name = TestData.randomWord;
                criteria.categoryId = this.catalogs.rankCriteria[1].id;
            })
        })
    }
    /**
     * Создание групп критериев и критериев для тестовой пролицензии сценария license.test.ts
     */
    public async createTestCriterias (api : Api) : Promise<void> {
        this.createCritGroups();
        for (const i of this.criterias) {
            await superagent.put(api.basicUrl + api.constructors.createCriteriaGrp).
            query({groupId: i.id, experts: i.experts});
        }
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
        isMulti: number | null,
        typeId: number,
        documents: TDocuments[]
}