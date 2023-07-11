import {InstanceApi} from "./instance.api";

export class AdminApi extends InstanceApi {
    /**
     * Add a user
     */
    public static addUser: string = `${this.baseUrl}/api/rest/admin/users`
    /**
     * Add or get roles
     */
    public static addOrGetRoles: string = `${this.baseUrl}/api/rest/admin/roles`
    /**
     * Get rights
     */
    public static rights: string = `${this.baseUrl}/api/rest/admin/rights`
    /**
     * Change criteria group
     */
    public static changeCriteriaGroup: string = `${this.baseUrl}/api/rest/admin/groups`
    /**
     * Change criteria ranks
     */
    public static changeCriteriaRank: string = `${this.baseUrl}/api/rest/admin/categories`
    /**
     * Change a user role
     */
    public static changeUserRole = (userId: number) => `${this.baseUrl}/api/rest/admin/users/${userId}/newRole`
    /**
     * Change user data
     */
    public static changeUser = (userId: number) => `${this.baseUrl}/api/rest/admin/users/${userId}`
    /**
     * Delete a role
     */
    public static deleteRole = (roleId: number) => `${this.baseUrl}/api/rest/admin/roles/${roleId}`
    /**
     * Delete a criteria group
     */
    public static deleteCriteriaGroup = (grpId: number) => `${this.baseUrl}/api/rest/admin/groups/${grpId}`
    /**
     * Delete a criteria rank
     */
    public static deleteCriteriaRank = (rankId: number) => `${this.baseUrl}/api/rest/admin/categories/${rankId}`
}