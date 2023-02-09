import {TestData} from "./test-data";
import {Catalogs} from "./catalogs";
import superagent, {Response} from "superagent";
import {Api} from "./api";

export class Prolicense {
    public  prolicense : TProlicense[];
    public catalogs = new Catalogs();
    constructor() {
        this.prolicense =[]
    }
    /**
     * Add a prolicense
     */
    public createProlicense() : TProlicense {
        const docArray : TDocuments[] = [...Array(5)].fill(
            {
            name: TestData.randomWord,
            description : TestData.descValue,
            docTypeId: this.catalogs.docTypes[0].id,
            templates: TestData.files
        }
        )
        this.prolicense.push(
            {
            name: TestData.randomWord,
            season: this.catalogs.seasons[0].name,
            type: this.catalogs.licTypes[0].name,
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
        this.prolicense[0].type = this.catalogs.licTypes[this.catalogs.licTypes.length-1].name;
        this.prolicense[0].season = this.catalogs.seasons[this.catalogs.seasons.length-1].name;
        this.prolicense[0].documents.push(
            {
            name: TestData.randomWord,
            description : TestData.descValue,
            docTypeId: this.catalogs.docTypes[0].id,
            templates: TestData.files
        }
        )
        return this.prolicense[0];
    }
    /**
     * Copy prolicense
     */
    public createSampleProlicense () : TSampleLicense {
        return {
            type : this.catalogs.licTypes[0].name,
            season : this.catalogs.seasons[0].name,
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
        send(this.prolicense[0]);
        this.fillProlicense(0,response);
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