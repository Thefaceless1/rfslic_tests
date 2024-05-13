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
                       (${userId},${UserRights.admClassificatorsManage}),
                       (${userId},${UserRights.admCritCategoryManage}),
                       (${userId},${UserRights.admCritGroupManage}),
                       (${userId},${UserRights.admExpertWorkloadManage}),
                       (${userId},${UserRights.admLicTextEdit}),
                       (${userId},${UserRights.admRoleManage}),
                       (${userId},${UserRights.commissionDelete}),
                       (${userId},${UserRights.commissionDocumentEdit}),
                       (${userId},${UserRights.commissionEdit}),
                       (${userId},${UserRights.commissionMembersEdit}),
                       (${userId},${UserRights.commissionView}),
                       (${userId},${UserRights.prolicCopy}),
                       (${userId},${UserRights.prolicDelete}),
                       (${userId},${UserRights.prolicEdit}),
                       (${userId},${UserRights.prolicView}),
                       (${userId},${UserRights.requestAdd}),
                       (${userId},${UserRights.requestCheck}),
                       (${userId},${UserRights.requestCheckExpert}),
                       (${userId},${UserRights.requestCommissionView}),
                       (${userId},${UserRights.requestDelete}),
                       (${userId},${UserRights.requestFill}),
                       (${userId},${UserRights.requestFillExpert}),
                       (${userId},${UserRights.requestGroupExpertEdit}),
                       (${userId},${UserRights.requestGroupReportAdd}),
                       (${userId},${UserRights.requestGroupReportEdit}),
                       (${userId},${UserRights.requestHistory}),
                       (${userId},${UserRights.requestViewAll}),
                       (${userId},${UserRights.requestSendLimitEdit}),
                       (${userId},${UserRights.requestSanctionsEdit}),
                       (${userId},${UserRights.requestDocsDeadlineEdit}),
                       (${userId},${UserRights.admRulesManage})
                       on conflict do nothing;`;
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
    /**
     * Delete rules
     */
    public async deleteRules(): Promise<void> {
        await this.sql`DELETE FROM rfslic.nsi_rule_versions
                       WHERE name LIKE ('автотест%');`;
    }
    /**
     * Delete classifiers categories
     */
    public async deleteCategoriesClassifiers(): Promise<void> {
        await this.sql`DELETE FROM rfslic.nsi_criteriacategories
                       WHERE description LIKE ('автотест%');`;
    }
    /**
     * Delete criteria groups
     */
    public async deleteCriteriaGroups(): Promise<void> {
        await this.sql`DELETE FROM rfslic.nsi_criteriagroups
                       WHERE name LIKE ('автотест%');`;
    }
}