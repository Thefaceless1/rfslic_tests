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
     * Create a new commission
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
     * Add requests for a commission
     */
    public async addRequests() : Promise<TRequests> {
        const api = new Api();
        const response = await superagent.get(api.basicUrl + api.request.requestsList).
        query({pageNum : 0, pageSize : 10});
        return {"licIds": response.body.data.map((value: TLicense) => value.id)};
    }
    /**
     * Add decision for a commission request
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
    /**
     * Add members for a commission type or for a commission
     */
    public addMembers() : TMembers {
        return {userIds : this.catalogs.commissionTypeMembersId}
    }
    /**
     * Add report by license type for a commission
     */
    public addReport(type : "byType" | "byClub") : TReport {
        const licTypes : {licType : string, count : number}[] =[];
        let mostPopLicType : {licType : string, count : number} = {licType: "", count: 0};
        const mostPopLicTypeIds : number[] = [];
        this.commission[0].licenses!.forEach(license => {
            if(licTypes.find(value => value.licType == license.licType)) {
                const foundType = licTypes.find(value => value.licType == license.licType);
                const index = licTypes.indexOf(foundType!);
                licTypes[index].count++;
            }
            else {
                licTypes.push({licType : license.licType,count : 0})
            }
        })
        licTypes.forEach((value, index) => {
            if(index == 0 || mostPopLicType.count < value.count) {
                mostPopLicType.licType = value.licType;
                mostPopLicType.count = value.count
            }
        })
        this.commission[0].licenses!.forEach(license => {
            if(license.licType == mostPopLicType.licType) mostPopLicTypeIds.push(license.licId);
        })
        return {licIds : mostPopLicTypeIds, licType : mostPopLicType.licType};
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
export type TMembers = {
    userIds : number[]
}
export type TRequests = {
    licIds : number[]
}
export type TReport = {
    licIds : number[],
    licType : string
}