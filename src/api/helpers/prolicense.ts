import {TestData} from "./test-data";
import {TDocTypes} from "./types/catalogs.type";
import {Catalogs} from "./catalogs";
import superagent, {Response} from "superagent";
import {Api} from "./api";
import {TCriterias, TDocuments, TProlicense, TSampleLicense} from "./types/prolicense.type";

export class Prolicense extends Catalogs {
    constructor(
        public  prolicense : TProlicense[] = [],
        public criterias : TCriterias[] = []
    ) {
        super();
    }
    /**
     * Add a prolicense
     */
    public createProlicense() : TProlicense {
        const docArray : TDocuments[] = [...Array(5)].fill({
            name: TestData.randomWord,
            description : TestData.descValue,
            docTypeId: this.docTypes[0].id,
            templates: this.files
        })
        this.prolicense.push({
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
        })
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
        this.prolicense[0].documents.push({
            name: TestData.randomWord,
            description : TestData.descValue,
            docTypeId: this.docTypes[0].id,
            templates: this.files
        })
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
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.fillProlicense(0,response);
    }
    /**
     * Add criteria groups
     */
    public createCritGroups () : void {
        this.criteriaGroups.forEach((value) => {
            this.criterias.push({
                    id : value.id,
                    name : value.name,
                    experts : this.critGrpExpertsId,
                    details : {
                        experts : this.critGrpExperts
                    },
                    criterias : []
            })
        })
    }
    /**
     * Add criterias and criteria documents
     */
    public createCriterias () : void {
        this.criterias.forEach((criteriaGroup) => {
                this.criteriaTypes.forEach((criteriaType,index) => {
                    const fileDocType : TDocTypes = this.docTypes.find(docType => docType.name == "Файл")!;
                    const docArray : TDocuments[] = [...new Array(3)].fill({
                        name: TestData.randomWord,
                        description : TestData.descValue,
                        docTypeId: fileDocType.id,
                        templates: this.files
                    })
                    criteriaGroup.criterias.push({
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
                    })
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
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        this.createCriterias();
        for(const criteriaGroup of this.criterias) {
            for(let criteria of criteriaGroup.criterias) {
                const index = criteriaGroup.criterias.indexOf(criteria);
                const response = await superagent.put(api.basicUrl + api.constructors.createCriterias).
                send(criteria).
                set("cookie", `${this.cookie}`).
                set("x-csrf-token",this.x_csrf_token);
                criteriaGroup.criterias[index] = response.body.data;
            }
        }
    }
    public async refreshProlicense(api : Api) : Promise<void> {
        const response = await superagent.get(api.basicUrl + api.constructors.changeProlicense).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.fillProlicense(0,response);
    }
}