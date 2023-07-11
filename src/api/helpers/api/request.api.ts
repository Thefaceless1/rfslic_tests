import {InstanceApi} from "./instance.api";

export class RequestApi extends InstanceApi {
    /**
     * Possible request statuses
     */
    public static possibleRequestStates: string = `${this.baseUrl}/api/rest/licenses/states`
    /**
     * Possible request statuses
     */
    public static possibleDocStates: string = `${this.baseUrl}/api/rest/licenses/docstates`
    /**
     * Create a request
     */
    public static createRequest: string = `${this.baseUrl}/api/rest/licenses`
    /**
     * Find requests
     */
    public static findRequests: string = `${this.baseUrl}/api/rest/licenses/find`
    /**
     * Delete a request file
     */
    public static deleteRequestFile = (fileId: number): string => `${this.baseUrl}/api/rest/licenses/files/${fileId}`
    /**
     * Delete a criteria file
     */
    public static deleteCriteriaFile = (fileId: number): string => `${this.baseUrl}/api/rest/licenses/criterias/files/${fileId}`
    /**
     * Get license data by id
     */
    public static getLicenseById = (licId: number): string => `${this.baseUrl}/api/rest/licenses/${licId}`
    /**
     * Publish a license
     */
    public static publishLicense = (licId: number): string => `${this.baseUrl}/api/rest/licenses/${licId}/publish`
    /**
     * Create an expert report
     */
    public static createExpertReport = (licId: number): string => `${this.baseUrl}/api/rest/licenses/${licId}/groupReport/generate`
    /**
     * Send all general info docs for verification
     */
    public static sendGeneralInfoDocsForVerification = (licId: number): string => `${this.baseUrl}/api/rest/licenses/${licId}/check`
    /**
     * Change club experts for criteria group
     */
    public static changeClubExperts = (licId: number, grpId: number): string => `${this.baseUrl}/api/rest/licenses/${licId}/groups/${grpId}/experts`
    /**
     * Change rfu experts for criteria group
     */
    public static changeRfuExpert = (licId: number, grpId: number): string => `${this.baseUrl}/api/rest/licenses/${licId}/groups/${grpId}/rfuExpert`
    /**
     * Add files to documents on general info tab
     */
    public static addGeneralInfoFiles = (docId: number): string => `${this.baseUrl}/api/rest/licenses/documents/${docId}/files`
    /**
     * Add files to criteria documents
     */
    public static addCritDocFiles = (docId: number): string => `${this.baseUrl}/api/rest/licenses/criterias/documents/${docId}/files`
    /**
     * Add external to criterias
     */
    public static addExternal = (critId: number): string => `${this.baseUrl}/api/rest/licenses/criterias/${critId}/external`
    /**
     * Send for verification all criteria group documents
     */
    public static sendCriteriaDocsForVerification = (licId: number,grpId: number): string => {
        return `${this.baseUrl}/api/rest/licenses/${licId}/groups/${grpId}/check`
    }
    /**
     * Change status for documents on general info tab
     */
    public static changeGeneralInfoDocStatus = (docId: number): string => `${this.baseUrl}/api/rest/licenses/documents/${docId}/status`
    /**
     * Change status for criteria documents
     */
    public static changeCriteriaDocStatus = (docId: number): string => `${this.baseUrl}/api/rest/licenses/criterias/documents/${docId}/status`
    /**
     * Add decision, recommendation and rpl criterias
     */
    public static addDecision = (licId: number): string => `${this.baseUrl}/api/rest/licenses/${licId}/decision`
    /**
     * Change a license status
     */
    public static changeLicStatus = (licId: number): string => `${this.baseUrl}/api/rest/licenses/${licId}/status`

}