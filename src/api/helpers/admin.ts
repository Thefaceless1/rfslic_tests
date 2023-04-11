import {Catalogs} from "./catalogs";
import {TestData} from "./test-data";
import {Response} from "superagent";
import {DbHelper} from "../../db/db-helper";
import {operationsLog, workUsers} from "../../db/tables";
import {TCritGroup, TCritRank, TRole, TUser} from "./types/admin.type";

export class Admin extends Catalogs {
    constructor(
        public user: TUser[] = [],
        public role: TRole[] = [],
        public critGroups : TCritGroup[] = [],
        public critRanks : TCritRank[] = []
    ) {
        super();
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
     * Add response data to "critGroups", "role", "user", "criteriaRanks" arrays
     */
    public fillEntity(array : "user" | "role" | "criteriaGroups" | "criteriaRanks", index : number, response : Response) : void {
        switch (array) {
            case "user" : this.user[index] = response.body.data; break;
            case "role" : this.role[index] = response.body.data; break;
            case "criteriaGroups" : this.critGroups[index] = response.body.data; break;
            default : this.critRanks[index] = response.body.data;
        }
    }
    /**
     * Check if the user exists in the database
     */
    public async checkUser() : Promise<void> {
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
    public addCriteriaGroup() : TCritGroup {
        this.critGroups.push({name : TestData.randomWord});
        return this.critGroups[0];
    }
    /**
     * Change a criteria group
     */
    public changeCriteriaGroup() : TCritGroup {
        this.critGroups[0].name = TestData.randomWord;
        this.critGroups[0].active = !this.critGroups[0].active;
        return this.critGroups[0];
    }
    /**
     * Add a criteria rank
     */
    public addCriteriaRank() : TCritRank {
        this.critRanks.push({
            code : TestData.randomCode(this.rankCriteria),
            description : TestData.randomWord
        })
        return this.critRanks[0];
    }
    /**
     * Change a criteria rank
     */
    public changeCriteriaRank() : TCritRank {
        this.critRanks[0].description = TestData.randomWord
        this.critRanks[0].code = TestData.randomCode(this.rankCriteria);
        return this.critRanks[0];
    }
}