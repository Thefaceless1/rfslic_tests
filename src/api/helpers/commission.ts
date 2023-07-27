import {FilesInterface, LicDocStatusInterface} from "./types/catalogs.interface";
import {Catalogs} from "./catalogs";
import {TestData} from "./test-data";
import superagent from "superagent";
import {LicenseInterface} from "./types/license.interface";
import {randomInt} from "crypto";
import {DbHelper} from "../../db/db-helper";
import {issuedLicense} from "../../db/tables";
import {LicStatus} from "./enums/license-status";
import {
    ClubReportInterface,
    CommissionInterface,
    DecisionInterface,
    FormLicenseInterface,
    LicTypeReportInterface,
    LicTypeTextInterface,
    MembersInterface,
    RequestsInterface
} from "./types/commission.interface";
import {CommissionApi} from "./api/commission.api";
import {RequestApi} from "./api/request.api";

export class Commission extends Catalogs {
    commission: CommissionInterface = {name: "", typeId: 0, workDate: ""}
    constructor() {
        super();
    }
    /**
     * Create a new commission
     */
    public async createCommission(): Promise<void> {
        const requestBody: CommissionInterface = {
            name: TestData.randomWord,
            typeId: this.commissionTypes[0].id,
            workDate: TestData.currentDate
        }
        const response = await superagent.put(CommissionApi.createCommission).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.commission = response.body.data;
    }
    /**
     * Add requests for a commission
     */
    public async addRequests() : Promise<number> {
        const response = await superagent.get(RequestApi.findRequests).
        query({pageNum : 0, pageSize : 10}).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        const licIds : number[] = response.body.data.map((license: LicenseInterface) => license.id);
        const requestBody: RequestsInterface = {licIds: licIds};
        const licStatusId : number = this.licStatusByEnum(LicStatus.waitForCommission).id;
        const dbHelper = new DbHelper();
        for(const licId of licIds) {
            await dbHelper.updateLicenseStatus(licId,licStatusId);
        }
        await dbHelper.closeConnect();
        await superagent.put(CommissionApi.addRequests(this.commission.id!)).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshCommission();
        return licIds.length;
    }
    /**
     * Delete a request
     */
    public async deleteRequest(): Promise<number> {
        const deletedRequestId: number = this.commission.licenses![0].licId;
        await superagent.delete(CommissionApi.deleteRequest(this.commission.id!,deletedRequestId)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshCommission();
        return deletedRequestId;
    }
    /**
     * Add decision for a commission request
     */
    public async addDecision(): Promise<void> {
        const filteredRequestStatus: LicDocStatusInterface[] = this.licStatus.
        filter(licStatus => licStatus.name == LicStatus.issued || licStatus.name == LicStatus.issuedWithConditions || licStatus.name == LicStatus.declined);
        for(const license of this.commission.licenses!) {
            const randomNumber: number = randomInt(0,filteredRequestStatus.length);
            const randomDecision: LicDocStatusInterface = filteredRequestStatus[randomNumber];
            const requestBody: DecisionInterface = {
                licStateId : randomDecision.id,
                controlDate : (randomDecision.name == LicStatus.issuedWithConditions) ? TestData.futureDate : "",
                comment : TestData.commentValue
            }
            await superagent.put(CommissionApi.changeCommissionRequest(this.commission.id!,license.licId)).
            send(requestBody).
            set("cookie", `${this.cookie}`).
            set("x-csrf-token",this.x_csrf_token);
        }
        await this.refreshCommission();
    }
    /**
     * Delete a request with a decision
     */
    public async deleteRequestWithError(): Promise<string> {
        let errorMessage: string = "";
        const deletedRequestId: number = this.commission.licenses![0].licId;
        await superagent.delete(CommissionApi.deleteRequest(this.commission.id!,deletedRequestId)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token).
        catch(reason => {
            errorMessage = JSON.parse(reason.response.text).error

        });
        return errorMessage
    }
    /**
     * Add members for a commission type
     */
    public async addCommissionTypeMembers(): Promise<string> {
        const selectedCommissionTypeId: number = this.commissionTypesId[0];
        const requestBody: MembersInterface = {userIds: this.commissionTypeMembersId};
        const response = await superagent.put(CommissionApi.commissionTypeMembers(selectedCommissionTypeId)).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        return response.body.status;
    }
    /**
     * Add members for a commission
     */
    public async addCommissionMembers(): Promise<string> {
        const requestBody: MembersInterface = {userIds: this.commissionTypeMembersId};
        const response = await superagent.put(CommissionApi.commissionMembers(this.commission.id!)).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        return response.body.status;
    }
    /**
     * Add protocol for a commission
     */
    public async addProtocol(): Promise<FilesInterface> {
        const requestBody: FilesInterface = this.files[0];
        await superagent.put(CommissionApi.addProtocol(this.commission.id!)).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        await this.refreshCommission()
        return requestBody
    }
    /**
     * Add report by license type or by club for a commission
     */
    public async addReport(type: "byType" | "byClub"): Promise<string> {
        type TLicType = {licTypeId: number, count: number};
        type TClub = {clubId: number, count: number};
        const licTypes: TLicType[] = [];
        const clubs: TClub[] = [];
        const mostPopLicType: TLicType = {licTypeId: 0, count: 0};
        const mostPopClub: TClub = {clubId : 0, count: 0};
        const mostPopLicTypeIds: number[] = [];
        const mostPopLicIds: number[] = []
        this.commission.licenses!.forEach(license => {
            if(licTypes.find(licType => licType.licTypeId == license.licTypeId)) {
                const foundType = licTypes.find(value => value.licTypeId == license.licTypeId);
                const index = licTypes.indexOf(foundType!);
                licTypes[index].count++;
            }
            else {
                licTypes.push({licTypeId : license.licTypeId, count : 0})
            }
            if(clubs.find(club => club.clubId == license.clubId)) {
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
                mostPopLicType.licTypeId = value.licTypeId;
                mostPopLicType.count = value.count
            }
        })
        clubs.forEach((value, index) => {
            if(index == 0 || mostPopClub.count < value.count) {
                mostPopClub.clubId= value.clubId;
                mostPopClub.count = value.count
            }
        })
        this.commission.licenses!.forEach(license => {
            if(license.licTypeId == mostPopLicType.licTypeId) mostPopLicTypeIds.push(license.licId);
            if(license.clubId == mostPopClub.clubId) mostPopLicIds.push(license.licId);
        })
        switch (type) {
            case "byType": {
                const requestBody: LicTypeReportInterface = {licIds : mostPopLicTypeIds, licType : mostPopLicType.licTypeId};
                const response = await superagent.post(CommissionApi.addReportByType(this.commission.id!)).
                send(requestBody).
                set("cookie", `${this.cookie}`).
                set("x-csrf-token",this.x_csrf_token);
                await this.refreshCommission();
                return response.body.status
            }
            case "byClub": {
                const requestBody: ClubReportInterface = {licIds : mostPopLicIds, clubId : mostPopClub.clubId};
                const response = await superagent.post(CommissionApi.addReportByClub(this.commission.id!)).
                send(requestBody).
                set("cookie", `${this.cookie}`).
                set("x-csrf-token",this.x_csrf_token);
                await this.refreshCommission();
                return response.body.status
            }
        }
    }
    /**
     * Add text for a license type
     */
    public async addLicTypeText(): Promise<string> {
        const requestBody: LicTypeTextInterface = {
            licType : this.licTypeIds[0],
            text : TestData.commentValue
        };
        const response = await superagent.put(CommissionApi.addLicenseText).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        return response.body.status;
    }
    /**
     * Form license
     */
    public async formLicense(): Promise<string> {
        const sendLicId: number = this.commission.licenses![0].licId;
        const requestBody: FormLicenseInterface = {licId: sendLicId};
        const dbHelper = new DbHelper();
        await dbHelper.delete(issuedLicense.tableName,issuedLicense.columns.licId,sendLicId);
        await dbHelper.closeConnect();
        const response = await superagent.put(CommissionApi.formLicense).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        return response.body.status
    }
    /**
     * Delete a commission file
     */
    public async deleteCommissionFile(): Promise<string> {
        const deletedFileId: number  = this.commission.files![0].id!
        const response = await superagent.delete(CommissionApi.deleteFile(deletedFileId)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        return response.body.status;
    }
    /**
     * Get commission data by id
     */
    public async refreshCommission(): Promise<void> {
        const response = await superagent.get(CommissionApi.commissionData(this.commission.id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.commission = response.body.data;
    }
    /**
     * Error when delete a commission with added requests
     */
    public async deleteCommissionWithError(): Promise<string> {
        let errorMessage: string = "";
        await superagent.delete(CommissionApi.commissionData(this.commission.id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token).
        catch(reason => {
            errorMessage = JSON.parse(reason.response.text).error;
        });
        return errorMessage;
    }
}