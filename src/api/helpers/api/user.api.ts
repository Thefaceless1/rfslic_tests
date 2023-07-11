import {InstanceApi} from "./instance.api";

export class UserApi extends InstanceApi {
    /**
     * Find persons with params
     */
    public static findPerson: string = `${this.baseUrl}/api/rest/persons/findbyparams`
    /**
     * Get club experts
     */
    public static clubExperts: string = `${this.baseUrl}/api/rest/persons/withRights`
    /**
     * Find organizations
     */
    public static findOrganizations: string = `${this.baseUrl}/api/rest/organizations/find`
    /**
     * Get current user
     */
    public static currentUser: string = `${this.baseUrl}/api/rest/info/currentUser`
    /**
     * Get active users
     */
    public static activeUsers: string = `${this.baseUrl}/userChoice/list`
    /**
     * Set a user
     */
    public static setUser = (userId: number): string => `${this.baseUrl}/userChoice/set/${userId}`
    /**
     * Get club experts by criteria group
     */
    public static clubExpertsByCriteriaGroup = (licId: number, grpId: number): string => {
        return `${this.baseUrl}/api/rest/licenses/${licId}/groups/${grpId}/clubExperts`;
    }
}