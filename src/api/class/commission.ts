import {Templates} from "./prolicense";
import {Catalogs, TClubWorkers} from "./catalogs";
import {TestData} from "../helpers/test-data";
import {Response} from "superagent";

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
}
export type TCommission = {
    id?: number,
    typeId: number,
    type?: string,
    name: string,
    workDate: string,
    protocolName?: string,
    protocolStorageId?: string,
    licenses?: [],
    files?: Templates[],
    members?: TClubWorkers[]
}