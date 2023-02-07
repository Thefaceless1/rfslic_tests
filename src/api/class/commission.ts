import {Templates} from "./prolicense";
import {Catalogs, TClubWorkers, TLicAndDocStatus} from "./catalogs";
import {TestData} from "../helpers/test-data";
import superagent, {Response} from "superagent";
import {Api} from "../helpers/api";
import {TLicense} from "./license";
import {randomInt} from "crypto";

export class Commission {
    public commission : TCommission[]
    public catalogs : Catalogs = new Catalogs()
    constructor() {
        this.commission=[]
    }
    /**
     * Create new commission
     */
    public createCommission() : TCommission {
        this.commission.push({
            typeId : this.catalogs.commissionTypesId[0],
            workDate : TestData.currentDate,
            name : TestData.randomWord
        })
        return this.commission[0];
    }
    /**
     * Add response data to "commission" array
     */
    public fillCommission(index : number, response : Response) : void {
        this.commission[index] = response.body.data;
    }
    /**
     * Adding requests for commission
     */
    public async addRequests() : Promise<{licIds : number[]}> {
        const api = new Api();
        const response = await superagent.get(api.basicUrl + api.request.requestsList).
        query({pageNum : 0, pageSize : 10});
        return {"licIds": response.body.data.map((value: TLicense) => value.id)};
    }
    /**
     * Add decision for commission request
     */
    public addDecision() : TDecision {
        const filteredRequestStatus : TLicAndDocStatus[] = this.catalogs.licStatus.
        filter(value => value.name == "Выдана" || value.name == "Выдана с условиями" || value.name == "Отказано");
        const randomNumber : number = randomInt(0,filteredRequestStatus.length);
        const randomDecision : TLicAndDocStatus = filteredRequestStatus[randomNumber];
        return {
            licStateId : randomDecision.id,
            controlDate : (randomDecision.name == "Выдана с условиями") ? TestData.futureDate : "",
            comment : TestData.commentValue
        }
    }
}
export type TCommission = {
    id?: number,
    typeId: number,
    type?: string,
    name: string,
    workDate: string,
    protocolName?: string,
    protocolStorageId?: string,
    licenses?: TLicenses[],
    files?: Templates[],
    members?: TClubWorkers[]
}
export type TLicenses = {
    licId: number,
    clubId: number,
    clubName: string,
    licType: string,
    season: string,
    licName: string,
    controlDate: string,
    comment: string,
    beginStateId: number,
    beginState: string,
    endStateId: number,
    endState: string
}
export type TDecision = {
    licStateId: number,
    controlDate: string,
    comment: string
}