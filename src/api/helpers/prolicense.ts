import {TestData} from "./test-data";
import {TDocTypes} from "./types/catalogs.type";
import {Catalogs} from "./catalogs";
import superagent from "superagent";
import {
    TCriteria,
    TCriteriaGroup,
    TDocuments,
    TProlicense,
    TSampleProlicense
} from "./types/prolicense.type";
import {ProlicTypes} from "./enums/prolic-types";
import {ConstructorApi} from "./api/constructor.api";
import {randomInt} from "crypto";

export class Prolicense extends Catalogs {
    constructor(
        public  prolicense: TProlicense[] = [],
        public criterias: TCriteriaGroup[] = []
    ) {
        super();
    }
    /**
     * Create a prolicense
     */
    public async createProlicense(): Promise<void> {
        const docsCount: number = 5;
        const docArray : TDocuments[] = [...Array(docsCount)].fill({
            name: TestData.randomWord,
            description : TestData.descValue,
            docTypeId: this.docTypes[0].id,
            templates: this.files
        })
        const requestBody: TProlicense = {
            name: TestData.randomWord,
            season: this.seasons[0].id,
            type: this.licTypes[0].id,
            proLicType: ProlicTypes.licensing,
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
        const response = await superagent.put(ConstructorApi.createProlicense).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.prolicense.push(response.body.data);
    }
    /**
     * Change prolicense attributes:
     * 1. Name
     * 2. Type
     * 3. Season
     * 4. documents
     * 5. Dates
     */
    public async changeProlicense(): Promise<void> {
        this.prolicense[0].name = TestData.randomWord;
        this.prolicense[0].type = this.licTypes[this.licTypes.length-1].id;
        this.prolicense[0].season = this.seasons[this.seasons.length-1].id;
        this.prolicense[0].proLicType = ProlicTypes.finControl;
        this.prolicense[0].dueDate = null;
        this.prolicense[0].begin = null;
        this.prolicense[0].end = null;
        this.prolicense[0].documents.push({
            name: TestData.randomWord,
            description : TestData.descValue,
            docTypeId: this.docTypes[0].id,
            templates: this.files
        })
        await superagent.put(ConstructorApi.changeProlicense(this.prolicense[0].id!)).
        send(this.prolicense[0]).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshProlicense();
    }
    /**
     * Copy a prolicense
     */
    public async cloneProlicense(): Promise<void> {
        const requestBody: TSampleProlicense = {
            type : this.licTypes[0].id,
            season : this.seasons[0].id,
            name : TestData.randomWord
        }
        const response = await superagent.put(ConstructorApi.cloneProlicense(this.prolicense[0].id!)).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.prolicense.push(response.body.data);
    }
    /**
     * Add criteria groups
     */
    public async createCriteriaGroups(): Promise<void> {
        for(const group of this.criteriaGroups) {
            await superagent.put(ConstructorApi.createCriteriaGroup(this.prolicense[0].id!)).
            query({groupId: group.id, experts: this.critGrpExpertsId}).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        await this.refreshCriteriaGroups();
    }
    /**
     * Add criterias and criteria documents
     */
    public async createCriterias(): Promise<void> {
        for(const group of this.criterias) {
            for(const criteriaType of this.criteriaTypes) {
                const typeIndex: number = this.criteriaTypes.indexOf(criteriaType);
                const fileDocType: TDocTypes = this.docTypes.find(docType => docType.name == "Файл")!;
                const docsCount: number = 3;
                const docArray: TDocuments[] = [...new Array(docsCount)].fill({
                    name: TestData.randomWord,
                    description: TestData.descValue,
                    docTypeId: fileDocType.id,
                    templates: this.files
                })
                const requestBody: TCriteria = {
                    groupId: group.id,
                    number: TestData.randomWord,
                    categoryId: this.rankCriteria[0].id,
                    name: TestData.randomWord,
                    description: TestData.descValue,
                    isMulti: (criteriaType.name == "Документы") ? null : TestData.randomIntForMulti,
                    typeId: this.criteriaTypes[typeIndex].id,
                    docSubmitDate: TestData.futureDate,
                    reviewDate: TestData.futureDate,
                    documents: docArray
                }
                await superagent.put(ConstructorApi.createOrGetCriteria(this.prolicense[0].id!)).
                send(requestBody).
                set("cookie", `${this.cookie}`).
                set("x-csrf-token",this.x_csrf_token);
            }
        }
        await this.refreshCriteriaGroups();
    }
    /**
     * Change criterias:
     * 1. Criteria number
     * 2. Criteria name
     * 3. Criteria rank
     */
    public async changeCriterias(): Promise<void> {
        for(const group of this.criterias) {
            for(const criteria of group.criterias) {
                criteria.number = TestData.randomWord;
                criteria.name = TestData.randomWord;
                criteria.categoryId = this.rankCriteria[randomInt(0,this.rankCriteria.length)].id;
                await superagent.put(ConstructorApi.changeCriterias(criteria.id!)).
                send(criteria).
                set("cookie", `${this.cookie}`).
                set("x-csrf-token",this.x_csrf_token);
            }
        }
        await this.refreshCriteriaGroups();
    }
    /**
     * Publish a prolicense
     */
    public async publishProlicense(): Promise<void> {
        await superagent.put(ConstructorApi.publishProlicense(this.prolicense[0].id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshProlicense();
    }
    /**
     * Get a prolicense data
     */
    public async refreshProlicense(): Promise<void> {
        const response = await superagent.get(ConstructorApi.changeProlicense(this.prolicense[0].id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.prolicense[0] = response.body.data;
    }
    /**
     * Get a criteria groups data
     */
    public async refreshCriteriaGroups(): Promise<void> {
        const response = await superagent.get(ConstructorApi.createOrGetCriteria(this.prolicense[0].id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.criterias = response.body.data.groups;
    }
    /**
     * Delete a prolicense
     */
    public async deleteProlicense(): Promise<string> {
        const response = await superagent.delete(ConstructorApi.changeProlicense(this.prolicense[1].id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        return response.body.status;
    }
    /**
     * Delete criterias
     */
    public async deleteCriterias(): Promise<void> {
        for(const group of this.criterias) {
            for(const criteria of group.criterias) {
                await superagent.delete(ConstructorApi.changeCriterias(criteria.id!)).
                set("cookie", `${this.cookie}`).
                set("x-csrf-token",this.x_csrf_token);
            }
        }
        await this.refreshCriteriaGroups();
    }
    /**
     * Delete criteria groups
     */
    public async deleteCriteriaGroups(): Promise<void> {
        for(const group of this.criterias) {
            await superagent.delete(ConstructorApi.deleteCriteriaGroup(this.prolicense[0].id!,group.id)).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        await this.refreshCriteriaGroups();
    }
    /**
     * Unpublish a prolicense
     */
    public async unpublishProlicense(): Promise<void> {
        await superagent.put(ConstructorApi.unpublishProlicense(this.prolicense[0].id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshProlicense();
    }
}