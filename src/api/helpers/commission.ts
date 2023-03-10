import {Templates} from "./prolicense";
import {Catalogs, TClubWorkers, TLicAndDocStatus} from "./catalogs";
import {TestData} from "./test-data";
import superagent, {Response} from "superagent";
import {Api} from "./api";
import {TLicense} from "./license";
import {randomInt} from "crypto";
import {DbHelper} from "../../db/db-helper";
import {issuedLicense} from "../../db/tables";
import {LicStatus} from "./enums/license-status";

export class Commission extends Catalogs {
    public commission : TCommission[]
    constructor() {
        super();
        this.commission=[]
    }
    /**
     * Create a new commission
     */
    public createCommission() : TCommission {
        this.commission.push({
            typeId : this.commissionTypesId[0],
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
        query({pageNum : 0, pageSize : 10}).
        set("cookie", `${this.cookie}`);
        return {"licIds": response.body.data.map((value: TLicense) => value.id)};
    }
    /**
     * Add decision for a commission request
     */
    public addDecision() : TDecision {
        const filteredRequestStatus : TLicAndDocStatus[] = this.licStatus.
        filter(value => value.name == LicStatus.issued || value.name == LicStatus.issuedWithConditions || value.name == LicStatus.declined);
        const randomNumber : number = randomInt(0,filteredRequestStatus.length);
        const randomDecision : TLicAndDocStatus = filteredRequestStatus[randomNumber];
        return {
            licStateId : randomDecision.id,
            controlDate : (randomDecision.name == LicStatus.issuedWithConditions) ? TestData.futureDate : "",
            comment : TestData.commentValue
        }
    }
    /**
     * Add members for a commission type or for a commission
     */
    public addMembers() : TMembers {
        return {userIds : this.commissionTypeMembersId}
    }
    /**
     * Add report by license type or by club for a commission
     */
    public addReport(type : "byType" | "byClub") : TLicTypeReport | TClubReport {
        type TLicType = {licType : string, count : number};
        type TClub = {clubId : number, count : number};
        const licTypes : TLicType[] = [];
        const clubs : TClub[] = [];
        const mostPopLicType : TLicType = {licType: "", count: 0};
        const mostPopClub : TClub = {clubId : 0, count: 0};
        const mostPopLicTypeIds : number[] = [];
        const mostPopLicIds : number[] = []
        this.commission[0].licenses!.forEach(license => {
            if(licTypes.find(value => value.licType == license.licType)) {
                const foundType = licTypes.find(value => value.licType == license.licType);
                const index = licTypes.indexOf(foundType!);
                licTypes[index].count++;
            }
            else {
                licTypes.push({licType : license.licType, count : 0})
            }
            if(clubs.find(value => value.clubId == license.clubId)) {
                const foundClub = clubs.find(value => value.clubId == license.clubId);
                const index = clubs.indexOf(foundClub!);
                clubs[index].count++;
            }
            else {
                clubs.push({clubId : license.clubId, count : 0})
            }
        })
        licTypes.forEach((value, index) => {
            if(index == 0 || mostPopLicType.count < value.count) {
                mostPopLicType.licType = value.licType;
                mostPopLicType.count = value.count
            }
        })
        clubs.forEach((value, index) => {
            if(index == 0 || mostPopClub.count < value.count) {
                mostPopClub.clubId= value.clubId;
                mostPopClub.count = value.count
            }
        })
        this.commission[0].licenses!.forEach(license => {
            if(license.licType == mostPopLicType.licType) mostPopLicTypeIds.push(license.licId);
            if(license.clubId == mostPopClub.clubId) mostPopLicIds.push(license.licId);
        })
        return (type == "byType") ?
            {licIds : mostPopLicTypeIds, licType : mostPopLicType.licType} :
            {licIds : mostPopLicIds, clubId : mostPopClub.clubId};
    }
    /**
     * Add text for a license type
     */
    public addLicTypeText() : TLicTypeText {
        return {licType : this.licTypeIds[0], text : TestData.commentValue};
    }
    /**
     * Form license
     */
    public async formLicense() : Promise<{ licId: number }> {
        const dbHelper = new DbHelper();
        await dbHelper.delete(issuedLicense.tableName,issuedLicense.columns.licId,this.commission[0].licenses![0].licId);
        await dbHelper.sql.end();
        return {licId : this.commission[0].licenses![0].licId};
    }/**
     * Get a commission by id
     */
    public async refreshCommission(api : Api) : Promise<void> {
        const response = await superagent.get(api.basicUrl + api.commissions.getCommission).
        set("cookie", `${this.cookie}`);
        this.fillCommission(0,response);
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
export type TLicTypeReport = {
    licIds : number[],
    licType : string
}
export type TClubReport = {
    licIds : number[],
    clubId : number
}
export type TLicTypeText = {
    licType : number,
    text : string
}