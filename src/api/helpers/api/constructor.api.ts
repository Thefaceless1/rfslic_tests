import {InstanceApi} from "./instance.api";

export class ConstructorApi extends InstanceApi {
    /**
     * Create a prolicense
     */
    public static createProlicense: string = `${this.baseUrl}/api/rest/prolicenses`
    /**
     * Change criterias
     */
    public static changeCriterias = (critId: number): string => `${this.baseUrl}/api/rest/prolicenses/criterias/${critId}`
    /**
     * Change prolicense
     */
    public static changeProlicense = (prolicId: number): string => `${this.baseUrl}/api/rest/prolicenses/${prolicId}`
    /**
     * Create a criteria group
     */
    public static createCriteriaGroup = (prolicId: number): string => `${this.baseUrl}/api/rest/prolicenses/${prolicId}/criterias/groupExperts`
    /**
     * Create a criteria or get criterias data
     */
    public static createOrGetCriteria = (prolicId: number): string => `${this.baseUrl}/api/rest/prolicenses/${prolicId}/criterias`
    /**
     * Clone a prolicense
     */
    public static cloneProlicense = (prolicId: number): string => `${this.baseUrl}/api/rest/prolicenses/clone/${prolicId}`
    /**
     * Publish a prolicense
     */
    public static publishProlicense = (prolicId: number): string => `${this.baseUrl}/api/rest/prolicenses/${prolicId}/publish`
    /**
     * Unpublish a prolicense
     */
    public static unpublishProlicense = (prolicId: number): string => `${this.baseUrl}/api/rest/prolicenses/${prolicId}/unpublish`
    /**
     * Delete a criteria group
     */
    public static deleteCriteriaGroup = (prolicId: number, grpId: number): string => {
        return `${this.baseUrl}/api/rest/prolicenses/${prolicId}/criterias/groups/${grpId}`;
    }
}