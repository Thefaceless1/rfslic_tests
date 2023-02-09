import {TDocuments} from "./prolicense";
import {Catalogs, TClubWorkers} from "./catalogs";
import {TestData} from "./test-data";
import superagent from "superagent";
import {Api} from "./api";

export class Criterias {
    public  criterias : TCriterias[]
    public catalogs = new Catalogs()
    constructor() {
        this.criterias =[]
    }
    /**
     * Add criteria groups
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
     * Add criterias and criteria documents
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
     * Change criterias:
     * 1. Criteria number
     * 2. Criteria name
     * 3. Criteria rank
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
     * Create criteria groups and criterias for the 'license.test.ts' test scenario
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