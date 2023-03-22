import postgres from "postgres";
import fs from "fs";
import {licenses, userRights, workUsers} from "./tables.js";
import {Roles} from "../e2e/page-objects/helpers/enums/roles.js";
import {UserRights} from "../e2e/page-objects/helpers/enums/user-rights.js";

export class DbHelper {
   public readonly sql : postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
       this.sql = postgres(this.configData())
    }
    /**
     * Delete data from tables
     */
    public async delete(table : string,column : string,data : number | string) : Promise<void> {
       await this.sql`DELETE FROM ${this.sql(table)} WHERE ${this.sql(column)} = ${data}`;
    }
    /**
     * Select data from tables
     */
    public async select(table : string,column : string,data : number | string | boolean) : Promise<postgres.RowList<postgres.Row[]>> {
        return this.sql`SELECT * FROM ${this.sql(table)} WHERE ${this.sql(column)} = ${data}`
    }
    /**
     * Add a user in 'work users' table
     */
    public async insertUser(userId : number) : Promise<void> {
        await this.sql`INSERT INTO ${this.sql(workUsers.tableName)} 
                       (${this.sql(workUsers.columns.userId)},${this.sql(workUsers.columns.isActive)},${this.sql(workUsers.columns.roleId)})
                        VALUES (${userId},true,${Roles.admin});`
    }
    /**
     * Add rights for a user in table 'user rights'
     */
    public async insertUserRights(userId : number) : Promise<void> {
        await this.sql`INSERT INTO ${this.sql(userRights.tableName)} 
                       (${this.sql(userRights.columns.userId)},${this.sql(userRights.columns.rightId)}) 
                       VALUES
                       (${userId},${UserRights["adm.classificators.manage"]}),
                       (${userId},${UserRights["adm.critCategory.manage"]}),
                       (${userId},${UserRights["adm.critGroup.manage"]}),
                       (${userId},${UserRights["adm.expertWorkload.manage"]}),
                       (${userId},${UserRights["adm.licText.edit"]}),
                       (${userId},${UserRights["adm.role.manage"]}),
                       (${userId},${UserRights["commission.delete"]}),
                       (${userId},${UserRights["commission.document.edit"]}),
                       (${userId},${UserRights["commission.edit"]}),
                       (${userId},${UserRights["commission.members.edit"]}),
                       (${userId},${UserRights["commission.view"]}),
                       (${userId},${UserRights["prolic.copy"]}),
                       (${userId},${UserRights["prolic.delete"]}),
                       (${userId},${UserRights["prolic.edit"]}),
                       (${userId},${UserRights["prolic.view"]}),
                       (${userId},${UserRights["request.add"]}),
                       (${userId},${UserRights["request.check"]}),
                       (${userId},${UserRights["request.checkExpert"]}),
                       (${userId},${UserRights["request.commission.view"]}),
                       (${userId},${UserRights["request.delete"]}),
                       (${userId},${UserRights["request.fill"]}),
                       (${userId},${UserRights["request.fillExpert"]}),
                       (${userId},${UserRights["request.groupExpert.edit"]}),
                       (${userId},${UserRights["request.groupReport.add"]}),
                       (${userId},${UserRights["request.groupReport.edit"]}),
                       (${userId},${UserRights["request.history"]}),
                       (${userId},${UserRights["request.viewAll"]});`
    }
    /**
     * db.config.json file parser
     */
    public configData() : object {
       return JSON.parse(fs.readFileSync("./src/db/db.config.json","utf-8"));
    }
    /**
     * Update state_id column in Licenses table
     */
    public async updateLicenseStatus(licIds : number, licStatusId : number) : Promise<void> {
        await this.sql`UPDATE ${this.sql(licenses.tableName)}
                       SET ${this.sql(licenses.columns.stateId)} = ${licStatusId}
                       WHERE ${this.sql(licenses.columns.id)} = ${licIds}`;
    }
}