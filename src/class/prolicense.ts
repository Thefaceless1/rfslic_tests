import {TestData} from "./test-data";
import {Catalogs} from "./catalogs";

export class Prolicense {
    public static prolicense : TProlicense[] = [];
    public static createProlicense() : void {
        Prolicense.prolicense.push(
            {
            name: TestData.getRandomWord(),
            season: Catalogs.seasons[0].name,
            type: Catalogs.licTypes[0].name,
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
                    docTypeId: Catalogs.docTypes[0].id,
                    templates: TestData.files
                }
            ]
        }
        )
    }
    public static changeProlicense () {
        this.getProlicense(0).name = TestData.getRandomWord();
        this.getProlicense(0).type = Catalogs.licTypes[1].name;
        this.getProlicense(0).season = Catalogs.seasons[1].name;
        this.getProlicense(0).documents.push(
            {
            name: TestData.getRandomWord(),
            docTypeId: Catalogs.docTypes[0].id,
            templates: TestData.files
        }
        )
    }
    public static createSampleProlicense () : TSampleLicense {
        return {
            type : Catalogs.licTypes[Catalogs.licTypes.length-1].name,
            season : Catalogs.seasons[0].name,
            name : TestData.getRandomWord()
        }
    }
    public static getProlicense (index : number) : TProlicense {
        return Prolicense.prolicense[index];
    }
    public static addResponseToProlicense (index : number,response : TProlicense) : void {
        this.prolicense[index] = response;
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