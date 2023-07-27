import postgres from "postgres";
import fs from "fs";
import {commissions, licenses, operationsLog, prolicenses, userRights, workUsers} from "./tables.js";
import {Roles} from "../e2e/page-objects/helpers/enums/roles.js";
import {UserRights} from "../e2e/page-objects/helpers/enums/user-rights.js";
import * as Process from "process";

export class DbHelper {
   public readonly sql: postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
       this.sql = postgres(this.configData())
    }
    /**
     * Delete data from tables
     */
    public async delete(table: string,column: string,data: number | string): Promise<void> {
       await this.sql`DELETE FROM ${this.sql(table)} WHERE ${this.sql(column)} = ${data}`;
    }
    /**
     * Select data from tables
     */
    public async select(table: string,column: string,data: number | string | boolean): Promise<postgres.RowList<postgres.Row[]>> {
        return this.sql`SELECT * FROM ${this.sql(table)} WHERE ${this.sql(column)} = ${data}`
    }
    /**
     * Create a user in the license module system
     */
    public async insertUser(userId: number): Promise<void> {
        await this.sql`INSERT INTO ${this.sql(workUsers.tableName)} 
                       (${this.sql(workUsers.columns.userId)},${this.sql(workUsers.columns.isActive)},${this.sql(workUsers.columns.roleId)})
                        VALUES (${userId},true,${Roles.admin})
                        on conflict do nothing;`
    }
    /**
     * Add rights for a user in table 'user rights'
     */
    public async insertUserRights(userId: number): Promise<void> {
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
                       (${userId},${UserRights["request.viewAll"]})
                       on conflict do nothing;`
    }
    /**
     * test.db.config.json and prod.db.config.json files parser
     */
    public configData(): object {
       return (Process.env.BRANCH == "prod") ?
           JSON.parse(fs.readFileSync("./src/db/prod.db.config.json","utf-8")) :
           JSON.parse(fs.readFileSync("./src/db/test.db.config.json","utf-8"));
    }
    /**
     * Update state_id column in Licenses table
     */
    public async updateLicenseStatus(licIds: number, licStatusId: number): Promise<void> {
        await this.sql`UPDATE ${this.sql(licenses.tableName)}
                       SET ${this.sql(licenses.columns.stateId)} = ${licStatusId}
                       WHERE ${this.sql(licenses.columns.id)} = ${licIds}`;
    }
    /**
     * Close connect to databases
     */
    public async closeConnect(): Promise<void> {
        await this.sql.end();
    }
    /**
     * Delete prod user data from 'users' and 'operations_log' tables
     */
    public async deleteProdUserData(prodUserId: number): Promise<void> {
        await this.sql`DELETE FROM ${this.sql(operationsLog.tableName)}
                       WHERE ${this.sql(operationsLog.columns.userId)} = ${prodUserId}`;
        await this.sql`DELETE FROM ${this.sql(workUsers.tableName)}
                       WHERE ${this.sql(workUsers.columns.userId)} = ${prodUserId}`;
    }
    /**
     * Delete prolicense from 'nsi_prolicenses' table
     */
    public async deleteProlicense(): Promise<void> {
        await this.sql`DELETE FROM ${this.sql(prolicenses.tableName)}
                       WHERE ${this.sql(prolicenses.columns.licName)} like ('автотест%');`
    }
    /**
     * Delete license from 'licenses' table
     */
    public async deleteLicense(): Promise<void> {
        await this.sql`DELETE FROM ${this.sql(licenses.tableName)}
                       WHERE ${this.sql(licenses.columns.id)} in
                       (SELECT ${this.sql(prolicenses.columns.id)}
                        FROM ${this.sql(licenses.tableName)}
                        INNER JOIN ${this.sql(prolicenses.tableName)}
                        on ${this.sql(licenses.columns.prolicId)} = ${this.sql(prolicenses.columns.id)}
                        WHERE ${this.sql(prolicenses.columns.licName)} like ('автотест%'));`
    }
    /**
     * Delete commission from 'commissions' table
     */
    public async deleteCommission(): Promise<void> {
        await this.sql`DELETE FROM ${this.sql(commissions.tableName)}
                       WHERE ${this.sql(commissions.columns.name)} like ('автотест%');`
    }
}