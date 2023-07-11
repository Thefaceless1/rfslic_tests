import {InstanceApi} from "./instance.api";

export class CommissionApi extends InstanceApi {
    /**
     * Get commission types
     */
    public static commissionTypes: string = `${this.baseUrl}/api/rest/commissions/types`
    /**
     * Get commission decisions
     */
    public static commissionDecisions: string = `${this.baseUrl}/api/rest/commissions/decisions`
    /**
     * Create a commission
     */
    public static createCommission: string = `${this.baseUrl}/api/rest/commissions`
    /**
     * Add a license text
     */
    public static addLicenseText: string = `${this.baseUrl}/api/rest/commissions/licenseText`
    /**
     * Form a license
     */
    public static formLicense: string = `${this.baseUrl}/api/rest/commissions/formLicense`
    /**
     * Delete a file
     */
    public static deleteFile = (fileId: number): string => `${this.baseUrl}/api/rest/commissions/files/${fileId}`
    /**
     * Change commission requests
     */
    public static changeCommissionRequest = (comId: number,licId: number): string => {
        return `${this.baseUrl}/api/rest/commissions/${comId}/licenses/${licId}`;
    }
    /**
     * Add requests
     */
    public static addRequests = (comId: number): string => `${this.baseUrl}/api/rest/commissions/${comId}/licenses`;
    /**
     * Get a commission data
     */
    public static commissionData = (comId: number): string => `${this.baseUrl}/api/rest/commissions/${comId}`;
    /**
     * Get members by commission type
     */
    public static commissionTypeMembers = (comTypeId: number): string => `${this.baseUrl}/api/rest/commissions/types/${comTypeId}/members`;
    /**
     * Get commission members
     */
    public static commissionMembers = (comId: number): string => `${this.baseUrl}/api/rest/commissions/${comId}/members`;
    /**
     * Add a protocol
     */
    public static addProtocol = (comId: number): string => `${this.baseUrl}/api/rest/commissions/${comId}/protocol`;
    /**
     * Add report by license type
     */
    public static addReportByType = (comId: number): string => `${this.baseUrl}/api/rest/commissions/${comId}/files/byType`;
    /**
     * Add report by club
     */
    public static addReportByClub = (comId: number): string => `${this.baseUrl}/api/rest/commissions/${comId}/files/byClub`;
    /**
     * Delete a request
     */
    public static deleteRequest = (comId: number,licId: number): string => {
        return `${this.baseUrl}/api/rest/commissions/${comId}/licenses/${licId}`;
    }
}