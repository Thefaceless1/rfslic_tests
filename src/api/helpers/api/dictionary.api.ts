import {InstanceApi} from "./instance.api";

export class DictionaryApi extends InstanceApi {
    /**
     * Seasons
     */
    public static seasons: string = `${this.baseUrl}/api/rest/seasons`
    /**
     * Criteria groups
     */
    public static criteriaGroups: string = `${this.baseUrl}/api/rest/prolicenses/criterias/groups`
    /**
     * License types
     */
    public static licTypes: string = `${this.baseUrl}/api/rest/lictypes`
    /**
     * Document types
     */
    public static docTypes: string = `${this.baseUrl}/api/rest/doctypes`
    /**
     * Criteria ranks
     */
    public static criteriaRanks: string = `${this.baseUrl}/api/rest/prolicenses/criterias/categories`
    /**
     * Criteria types
     */
    public static criteriaTypes: string = `${this.baseUrl}/api/rest/prolicenses/criterias/types`
}