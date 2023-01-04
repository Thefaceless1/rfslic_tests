import {TestData} from "../helpers/test-data";
import {Catalogs, TSeasons, TDocTypes, TLicTypes} from "./catalogs";
import superagent from "superagent";
import {RequestProp} from "../helpers/request-prop";

export class Prolicense {
    public  prolicense : TProlicense[];
    public catalogs = new Catalogs();
    constructor() {
        this.prolicense =[]
    }
    public static createProlicense(prolicense : TProlicense[],season : TSeasons[], licType : TLicTypes[], docType : TDocTypes[]) : void {
        const docArray : TDocuments[] = [...Array(5)].fill(
            {
            name: TestData.getRandomWord,
            docTypeId: docType[0].id,
            templates: TestData.files
        }
        )
        prolicense.push(
            {
            name: TestData.getRandomWord,
            season: season[0].name,
            type: licType[0].name,
            requestBegin: TestData.getTodayDate,
            requestEnd: TestData.getFutureDate,
            dueDate: TestData.getFutureDate,
            docSubmitDate: TestData.getFutureDate,
            reviewDate: TestData.getFutureDate,
            decisionDate: TestData.getFutureDate,
            begin: TestData.getTodayDate,
            end: TestData.getFutureDate,
            documents: docArray
        }
        )
    }
    public static changeProlicense (prolicense : TProlicense[],season : TSeasons[], licType : TLicTypes[], docType : TDocTypes[]) {
        this.getProlicense(prolicense,0).name = TestData.getRandomWord;
        this.getProlicense(prolicense,0).type = licType[1].name;
        this.getProlicense(prolicense,0).season = season[1].name;
        this.getProlicense(prolicense,0).documents.push(
            {
            name: TestData.getRandomWord,
            docTypeId: docType[0].id,
            templates: TestData.files
        }
        )
    }
    public static createSampleProlicense (season : TSeasons[], licType : TLicTypes[]) : TSampleLicense {
        return {
            type : licType[licType.length-1].name,
            season : season[0].name,
            name : TestData.getRandomWord
        }
    }
    public static getProlicense (prolicense : TProlicense[], index : number) : TProlicense {
        return prolicense[index];
    }
    public static addResponseToProlicense (prolicense : TProlicense[],index : number,response : TProlicense) : void {
        prolicense[index] = response;
    }
    public static async createTestProlicense (prolicense : TProlicense[],seasons : TSeasons[],licTypes : TLicTypes[],docTypes : TDocTypes[]) : Promise<void> {
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