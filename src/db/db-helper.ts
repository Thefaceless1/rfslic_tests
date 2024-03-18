import postgres from "postgres";
import {Role} from "../e2e/page-objects/helpers/enums/Role.js";
import {UserRights} from "../e2e/page-objects/helpers/enums/UserRights.js";
import {dbConfig} from "./db.config.js";
import {InputData} from "../e2e/page-objects/helpers/InputData.js";

export class DbHelper {
   public readonly sql: postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
       this.sql = postgres(dbConfig)
    }
    /**
     * Delete data from tables
     */
    public async delete(table: string,column: string,data: number | string): Promise<void> {
       await this.sql`DELETE FROM ${this.sql(table)} 
                      WHERE ${this.sql(column)} = ${data}`;
    }
    /**
     * Select data from tables
     */
    public async select(table: string,column: string,data: number | string | boolean): Promise<postgres.RowList<postgres.Row[]>> {
        return this.sql`SELECT * FROM ${this.sql(table)} 
                        WHERE ${this.sql(column)} = ${data}`
    }
    /**
     * Create a user in the license module system
     */
    public async insertUser(userId: number): Promise<void> {
        await this.sql`INSERT INTO rfslic.work_users 
                       (user_id,is_active,role_id)
                        VALUES (${userId},true,${Role.admin})
                        on conflict do nothing;`;
    }
    /**
     * Add rights for a user in table 'user rights'
     */
    public async insertUserRights(userId: number): Promise<void> {
        await this.sql`INSERT INTO rfslic.work_user_rights 
                       (user_id,right_id) 
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
                       (${userId},${UserRights["request.viewAll"]}),
                       (${userId},${UserRights["request.sendLimit.edit"]}),
                       (${userId},${UserRights["request.sanctions.edit"]}),
                       (${userId},${UserRights["request.docsDeadline.edit"]})
                       on conflict do nothing;`;
    }
    /**
     * Update state_id column in Licenses table
     */
    public async updateLicenseStatus(licIds: number, licStatusId: number): Promise<void> {
        await this.sql`UPDATE rfslic.licenses
                       SET state_id = ${licStatusId}
                       WHERE id = ${licIds}`;
    }
    /**
     * Close connect to databases
     */
    public async closeConnect(): Promise<void> {
        await this.sql.end();
    }
    /**
     * Delete user data from 'users' and 'operations_log' tables
     */
    public async deleteUserData(userId: number): Promise<void> {
        try {
            await this.sql`DELETE FROM rfslic.work_operations_log
                       WHERE user_id = ${userId}`;
            await this.sql`DELETE FROM rfslic.work_users
                       WHERE user_id = ${userId}`;
        }
        catch (err) {
             await this.deleteUserData(userId);
        }
    }
    /**
     * Delete prolicense from 'nsi_prolicenses' table
     */
    public async deleteProlicense(): Promise<void> {
        await this.sql`DELETE FROM rfslic.nsi_prolicenses
                       WHERE licname LIKE ('автотест%');`;
    }
    /**
     * Delete license from 'licenses' table
     */
    public async deleteLicense(): Promise<void> {
        await this.sql`WITH pro as
                       (SELECT id
                        FROM rfslic.nsi_prolicenses
                        WHERE licname LIKE ('автотест%'))
                       DELETE FROM rfslic.licenses
                       WHERE prolic_id IN 
                       (SELECT id FROM pro)`;
    }
    /**
     * Delete commission from 'commissions' table
     */
    public async deleteCommission(): Promise<void> {
        await this.sql`DELETE FROM rfslic.commissions
                       WHERE name LIKE ('автотест%');`;
    }
    /**
     * Delete sanction types
     */
    public async deleteSanctionTypes(): Promise<void> {
        await this.sql`DELETE FROM rfslic.nsi_sanction_types
                       WHERE text LIKE ('автотест%');`;
    }
    /**
     * Delete violations
     */
    public async deleteViolations(): Promise<void> {
        await this.sql`DELETE FROM rfslic.nsi_violations
                       WHERE name LIKE ('автотест%');`;
    }
    /**
     * Insert a violation
     */
    public async insertViolation(): Promise<void> {
        await this.sql`INSERT INTO rfslic.nsi_violations (name,is_auto,text,event_description)
                       VALUES (${InputData.randomWord},false,${InputData.randomWord},${InputData.randomWord});`;
    }
    /**
     * Delete sanctions
     */
    public async deleteSanctions(): Promise<void> {
        await this.sql`DELETE from rfslic.nsi_sanctions 
                       WHERE violation_id IN (SELECT id from rfslic.nsi_violations WHERE name LIKE 'автотест%');`;
    }
    /**
     * Getting name of fine sanction type
     */
    public async getFineSanctionTypeName(): Promise<string> {
        const fineSanctionTypeId: number = 1;
        const result: postgres.RowList<postgres.Row[]> = await this.sql`SELECT text FROM rfslic.nsi_sanction_types
                                                                        WHERE id = ${fineSanctionTypeId};`;
        if(result.length == 0) throw new Error(`Отсутсвует тип санкции с id ${fineSanctionTypeId}`);
        return result[0].text;
    }
    /**
     * Getting the name of the violation "Return of the RFU expert's report for revision"
     */
    public async getReturnRfuViolationName(): Promise<string> {
        const returnRfuViolationId: number = 2;
        const result: postgres.RowList<postgres.Row[]> = await this.sql`SELECT name FROM rfslic.nsi_violations
                                                                        WHERE id = ${returnRfuViolationId};`;
        if(result.length == 0) throw new Error(`Отсутсвует нарушение с id ${returnRfuViolationId}`);
        return result[0].name;
    }
}