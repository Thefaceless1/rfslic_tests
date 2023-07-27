import {Catalogs} from "./catalogs";
import {TestData} from "./test-data";
import superagent from "superagent";
import {DbHelper} from "../../db/db-helper";
import {operationsLog, workUsers} from "../../db/tables";
import {
    AddUserInterface,
    ChangeRoleInterface,
    CritGroupInterface,
    CritRankInterface,
    RoleInterface,
    UserInterface
} from "./types/admin.interface";
import {AdminApi} from "./api/admin.api";

export class Admin extends Catalogs {
    constructor(
        public user: UserInterface[] = [],
        public role: RoleInterface[] = [],
        public critGroups: CritGroupInterface[] = [],
        public critRanks: CritRankInterface[] = [],
        public selectedUserRoleId: number = 0,
        public selectedUserId: number = 0
    ) {
        super();
    }
    /**
     * Add a user
     */
    public async addUser(): Promise<void> {
        this.selectedUserRoleId = this.rolesId[0];
        this.selectedUserId = this.personsId[0];
        const requestQuery: AddUserInterface = {roleId: this.selectedUserRoleId,userId: this.selectedUserId};
        const response = await superagent.put(AdminApi.addUser).
        query(requestQuery).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.user.push(response.body.data);
    }
    /**
     * 1. Add criteria groups to user
     * 2. if user role have property value isClub=true then add clubs
     */
    public async changeUser(): Promise<void> {
        this.user[0].groups = [...this.criteriaGrpId];
        const currentUserRoleData = this.roles.find(role => role.id == this.selectedUserRoleId);
        if(currentUserRoleData && currentUserRoleData.isClub) this.user[0].clubs = [...this.orgId];
        const response = await superagent.put(AdminApi.changeUser(this.user[0].id)).
        send(this.user[0]).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.user[0] = response.body.data;
    }
    /**
     * Change a user role
     */
    public async changeUserRole(): Promise<void> {
        this.selectedUserRoleId = this.rolesId[this.rolesId.length-1];
        const requestQuery: ChangeRoleInterface = {roleId: this.selectedUserRoleId};
        const response = await superagent.put(AdminApi.changeUserRole(this.user[0].id)).
        query(requestQuery).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.user[0] = response.body.data;
    }
    /**
     * Create a new role
     */
    public async addRole(): Promise<void> {
        const requestBody: RoleInterface = {
            name : TestData.randomWord,
            isClub : true,
            description : TestData.descValue,
            rights : [...this.rightsId]
        }
        const response = await superagent.put(AdminApi.addOrGetRoles).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.role.push(response.body.data);
    }
    /**
     * Delete a role
     */
    public async deleteRole(): Promise<string> {
        const response = await superagent.delete(AdminApi.deleteRole(this.role[0].id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        return response.body.status
    }
    /**
     * Check if the user exists in the database
     */
    public async checkUser(): Promise<void> {
        const dbHelper = new DbHelper();
        const dbUserData = await dbHelper.select(workUsers.tableName,workUsers.columns.userId,this.personsId[0]);
        if (dbUserData.length != 0) {
            await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,this.personsId[0]);
            await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,this.personsId[0]);
        }
        await dbHelper.closeConnect();
    }
    /**
     * Add a criteria group
     */
    public async addCriteriaGroup(): Promise<void> {
        const requestBody: CritGroupInterface = {name: TestData.randomWord};
        const response = await superagent.put(AdminApi.changeCriteriaGroup).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.critGroups.push(response.body.data);
    }
    /**
     * Change a criteria group
     */
    public async changeCriteriaGroup(): Promise<void> {
        const requestBody: CritGroupInterface = {
            id: this.critGroups[0].id,
            name: TestData.randomWord,
            active: false
        }
        const response = await superagent.put(AdminApi.changeCriteriaGroup).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.critGroups[0] = response.body.data;
    }
    /**
     * Delete a criteria group
     */
    public async deleteCriteriaGroup(): Promise<string> {
        const response = await superagent.delete(AdminApi.deleteCriteriaGroup(this.critGroups[0].id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        return response.body.status
    }
    /**
     * Add a criteria rank
     */
    public async addCriteriaRank(): Promise<void> {
        const requestBody: CritRankInterface = {
            code : TestData.randomCode(this.rankCriteria),
            description : TestData.randomWord
        }
        const response = await superagent.put(AdminApi.changeCriteriaRank).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.critRanks.push(response.body.data);
    }
    /**
     * Change a criteria rank
     */
    public async changeCriteriaRank(): Promise<CritRankInterface> {
        const oldCriteriaRankData: CritRankInterface = this.critRanks[0];
        const requestBody: CritRankInterface = {
            id: this.critRanks[0].id,
            description: TestData.randomWord,
            code: TestData.randomCode(this.rankCriteria)
        }
        const response = await superagent.put(AdminApi.changeCriteriaRank).
        send(requestBody).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        this.critRanks[0] = response.body.data;
        return oldCriteriaRankData
    }
    /**
     * Delete a criteria rank
     */
    public async deleteCriteriaRank(): Promise<string> {
        const response = await superagent.delete(AdminApi.deleteCriteriaRank(this.critRanks[0].id!)).
        set("cookie", `${this.cookie}`).
        set("x-csrf-token",this.x_csrf_token);
        return response.body.status;
    }
}