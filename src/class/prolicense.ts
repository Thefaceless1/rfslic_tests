import {TestData} from "./test-data";
import {Catalogs, TCurrentSeason, TDocTypes, TLicTypes} from "./catalogs";
import superagent from "superagent";
import {RequestProp} from "./request-prop";

export class Prolicense {
    public  prolicense : TProlicense[];
    constructor() {
        this.prolicense =[]
    }
    public static createProlicense(prolicense : TProlicense[],season : TCurrentSeason[], licType : TLicTypes[], docType : TDocTypes[]) : void {
        prolicense.push(
            {
            name: TestData.getRandomWord(),
            season: season[0].name,
            type: licType[0].name,
            requestBegin: TestData.dateNow,
            requestEnd: TestData.dateFuture,
            dueDate: TestData.dateFuture,
            docSubmitDate: TestData.dateFuture,
            reviewDate: TestData.dateFuture,
            decisionDate: TestData.dateFuture,
            begin: TestData.dateNow,
            end: TestData.dateFuture,
            documents: [
                {
                    name: TestData.getRandomWord(),
                    docTypeId: docType[0].id,
                    templates: TestData.files
                }
            ]
        }
        )
    }
    public static changeProlicense (prolicense : TProlicense[],season : TCurrentSeason[], licType : TLicTypes[], docType : TDocTypes[]) {
        this.getProlicense(prolicense,0).name = TestData.getRandomWord();
        this.getProlicense(prolicense,0).type = licType[1].name;
        this.getProlicense(prolicense,0).season = season[1].name;
        this.getProlicense(prolicense,0).documents.push(
            {
            name: TestData.getRandomWord(),
            docTypeId: docType[0].id,
            templates: TestData.files
        }
        )
    }
    public static createSampleProlicense (season : TCurrentSeason[], licType : TLicTypes[]) : TSampleLicense {
        return {
            type : licType[licType.length-1].name,
            season : season[0].name,
            name : TestData.getRandomWord()
        }
    }
    public static getProlicense (prolicense : TProlicense[], index : number) : TProlicense {
        return prolicense[index];
    }
    public static addResponseToProlicense (prolicense : TProlicense[],index : number,response : TProlicense) : void {
        prolicense[index] = response;
    }
    public static async createTestProlicense (prolicense : TProlicense[],seasons : TCurrentSeason[],licTypes : TLicTypes[],docTypes : TDocTypes[]) : Promise<void> {
        const api = new RequestProp();
        this.createProlicense(prolicense,seasons,licTypes,docTypes);
        //Создаем пролицензию и записываем ответ в свойство prolicense
        const response = await superagent.put(RequestProp.basicUrl + api.constructors.createProlicense).
        send(Prolicense.getProlicense(prolicense,0));
        Prolicense.addResponseToProlicense(prolicense,0,response.body.data);
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
    docTypeId: number,
    templates: {
        id?: number,
        name: string,
        storageId: string
    }[]
}
export type TSampleLicense = {
    type : string,
    season : string,
    name : string
}