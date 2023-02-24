import {TestData} from "./test-data";
import {Catalogs, TClubWorkers} from "./catalogs";
import superagent, {Response} from "superagent";
import {Api} from "./api";

export class Prolicense extends Catalogs {
    public  prolicense : TProlicense[]
    public criterias : TCriterias[]
    constructor() {
        super();
        this.prolicense =[]
        this.criterias=[]
    }
    /**
     * Add a prolicense
     */
    public createProlicense() : TProlicense {
        const docArray : TDocuments[] = [...Array(5)].fill(
            {
            name: TestData.randomWord,
            description : TestData.descValue,
            docTypeId: this.docTypes[0].id,
            templates: this.files
        }
        )
        this.prolicense.push(
            {
            name: TestData.randomWord,
            season: this.seasons[0].name,
            type: this.licTypes[0].name,
            requestBegin: TestData.currentDate,
            requestEnd: TestData.futureDate,
            dueDate: TestData.futureDate,
            docSubmitDate: TestData.futureDate,
            reviewDate: TestData.futureDate,
            decisionDate: TestData.futureDate,
            begin: TestData.currentDate,
            end: TestData.futureDate,
            documents: docArray
        }
        )
        return this.prolicense[0];
    }
    /**
     * Change prolicense attributes:
     * 1. Name
     * 2. Type
     * 3. Season
     * 4. Add document
     */
    public changeProlicense () : TProlicense {
        this.prolicense[0].name = TestData.randomWord;
        this.prolicense[0].type = this.licTypes[this.licTypes.length-1].name;
        this.prolicense[0].season = this.seasons[this.seasons.length-1].name;
        this.prolicense[0].documents.push(
            {
            name: TestData.randomWord,
            description : TestData.descValue,
            docTypeId: this.docTypes[0].id,
            templates: this.files
        }
        )
        return this.prolicense[0];
    }
    /**
     * Copy prolicense
     */
    public createSampleProlicense () : TSampleLicense {
        return {
            type : this.licTypes[0].name,
            season : this.seasons[0].name,
            name : TestData.randomWord
        }
    }
    /**
     * Add response body to the 'prolicense' array
     */
    public fillProlicense (index : number,response : Response) : void {
        this.prolicense[index] = response.body.data;
    }
    /**
     * Create prolicense for the 'license.test.ts' test scenario
     */
    public async createTestProlicense () : Promise<void> {
        const api = new Api();
        this.createProlicense();
        const response = await superagent.put(api.basicUrl + api.constructors.createProlicense).
        send(this.prolicense[0]).
        set("cookie", `${this.cookie}`);
        this.fillProlicense(0,response);
    }
    /**
     * Add criteria groups
     */
    public createCritGroups () : void {
        this.criteriaGroups.forEach((value) => {
            this.criterias.push(
                {
                    id : value.id,
                    name : value.name,
                    experts : this.critGrpExpertsId,
                    details : {
                        experts : this.critGrpExperts
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
                this.criteriaTypes.forEach((criteriaType,index) => {
                    const randomDocNumber : number = TestData.randomIntForDocs(this.docTypesForCrit(criteriaType));
                    const docArray : TDocuments[] = [...new Array(3)].fill({
                        name: TestData.randomWord,
                        description : TestData.descValue,
                        docTypeId: this.docTypesForCrit(criteriaType)[randomDocNumber].id,
                        templates: (randomDocNumber != 5 && randomDocNumber != 6 && randomDocNumber != 9) ? this.files : []
                    })
                    criteriaGroup.criterias.push(
                        {
                            groupId: criteriaGroup.id,
                            number: TestData.randomWord,
                            categoryId: this.rankCriteria[0].id,
                            name: TestData.randomWord,
                            description: TestData.descValue,
                            isMulti: (criteriaType.name == "Документы") ? null : TestData.randomIntForMulti,
                            typeId: this.criteriaTypes[index].id,
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
                criteria.categoryId = this.rankCriteria[1].id;
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
            query({groupId: i.id, experts: i.experts}).
            set("cookie", `${this.cookie}`);
        }
        this.createCriterias();
        for(const criteriaGroup of this.criterias) {
            for(let criteria of criteriaGroup.criterias) {
                const index = criteriaGroup.criterias.indexOf(criteria);
                const response = await superagent.put(api.basicUrl + api.constructors.createCriterias).
                send(criteria).
                set("cookie", `${this.cookie}`);
                criteriaGroup.criterias[index] = response.body.data;
            }
        }
    }
}

export type TProlicense = {
    id?: number
    type: string
    season: string
    name: string
    begin: string
    end: string
    requestBegin: string
    requestEnd: string
    docSubmitDate: string
    dueDate: string
    reviewDate: string
    decisionDate: string
    stateId? : number
    documents :  TDocuments[]
}

export type TDocuments = {
    id?: number
    name: string,
    description : string
    docTypeId: number,
    templates: Templates[]
}
export type TSampleLicense = {
    type : string,
    season : string,
    name : string
}
export type Templates = {
    id?: number,
    name: string,
    storageId: string
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