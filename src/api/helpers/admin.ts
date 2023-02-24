import {Catalogs, TCriteriaGroups, TOrganization} from "./catalogs";
import {TestData} from "./test-data";
import {Response} from "superagent";
import {DbHelper} from "../../db/db-helper";
import {operationsLog, workUsers} from "../../db/tables";

export class Admin extends Catalogs {
    public user: TUser[]
    public role: TRole[]
    constructor() {
        super();
        this.user = []
        this.role = []
    }
    /**
     * 1. Add criteria groups to the user
     * 2. if user role have property value isClub=true then add clubs
     */
    public changeUser() : TUser {
        this.user[0].groups = [...this.criteriaGrpId];
        if(this.roles[1].isClub) this.user[0].clubs = [...this.orgId];
        return this.user[0];
    }
    /**
     * Create a new role
     */
    public addRole() : TRole {
        this.role.push({
            name : TestData.randomWord,
            isClub : true,
            description : TestData.descValue,
            rights : [...this.rightsId]
        })
        return this.role[0];
    }
    /**
     * Add response data to "user" array
     */
    public fillUser(index : number, response : Response) : void {
        this.user[index] = response.body.data;
    }
    /**
     * Add response data to "role" array
     */
    public fillRole(index : number, response : Response) : void {
        this.role[index] = response.body.data;
    }
    /**
     * Check if the user exists in the database
     */
    public async checkUser() : Promise<void> {
        const dbHelper = new DbHelper();
        const dbUserData = await dbHelper.select(workUsers.tableName,workUsers.columns.userId,this.clubWorkersId[0]);
        if (dbUserData.length != 0) {
            await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,this.clubWorkersId[0]);
            await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,this.clubWorkersId[0]);
        }
        await dbHelper.sql.end();
    }
}

export type TUser = {
    id: number,
    details: {
        id: number,
        rfsId: number,
        fio: string,
        firstName: string,
        middleName: string,
        lastName: string,
        birthDate: string,
        orgName: string,
        position: string,
        sportRole: string
    },
    roleId: number,
    active: boolean,
    rights: string[],
    groups: TCriteriaGroups[] | number[],
    clubs: TOrganization[] | number[],
    licTypes: []
}
export type TRole = {
    id?: number,
    name: string,
    description: string,
    isBase?: boolean,
    isClub: boolean,
    rights: string[]
}