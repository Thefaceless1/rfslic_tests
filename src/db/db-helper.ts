import postgres from "postgres";
import fs from "fs";
import {licenses, userNotifications, userRights, workUsers} from "./tables.js";
import {Roles} from "../e2e/page-objects/helpers/enums/roles.js";
import {UserRights} from "../e2e/page-objects/helpers/enums/user-rights.js";
import {NotificationRoles} from "../e2e/page-objects/helpers/enums/notification-roles.js";

export class DbHelper {
   public readonly sqlLic : postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
   public readonly sqlNot : postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
       this.sqlLic = postgres(this.configData("license"))
        this.sqlNot = postgres(this.configData("notification"))
    }
    /**
     * Delete data from tables
     */
    public async delete(table : string,column : string,data : number | string) : Promise<void> {
       await this.sqlLic`DELETE FROM ${this.sqlLic(table)} WHERE ${this.sqlLic(column)} = ${data}`;
    }
    /**
     * Select data from tables
     */
    public async select(table : string,column : string,data : number | string | boolean) : Promise<postgres.RowList<postgres.Row[]>> {
        return this.sqlLic`SELECT * FROM ${this.sqlLic(table)} WHERE ${this.sqlLic(column)} = ${data}`
    }
    /**
     * Create a user in the license module system
     */
    public async insertUser(userId : number) : Promise<void> {
        await this.sqlLic`INSERT INTO ${this.sqlLic(workUsers.tableName)} 
                       (${this.sqlLic(workUsers.columns.userId)},${this.sqlLic(workUsers.columns.isActive)},${this.sqlLic(workUsers.columns.roleId)})
                        VALUES (${userId},true,${Roles.admin});`
    }
    /**
     * Add rights for a user in table 'user rights'
     */
    public async insertUserRights(userId : number) : Promise<void> {
        await this.sqlLic`INSERT INTO ${this.sqlLic(userRights.tableName)} 
                       (${this.sqlLic(userRights.columns.userId)},${this.sqlLic(userRights.columns.rightId)}) 
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
     * license.db.config.json file parser
     */
    public configData(db : "license" | "notification") : object {
       return (db == "license") ?
           JSON.parse(fs.readFileSync("./src/db/license.db.config.json","utf-8")) :
           JSON.parse(fs.readFileSync("./src/db/notification.db.config.json","utf-8"));
    }
    /**
     * Update state_id column in Licenses table
     */
    public async updateLicenseStatus(licIds : number, licStatusId : number) : Promise<void> {
        await this.sqlLic`UPDATE ${this.sqlLic(licenses.tableName)}
                       SET ${this.sqlLic(licenses.columns.stateId)} = ${licStatusId}
                       WHERE ${this.sqlLic(licenses.columns.id)} = ${licIds}`;
    }
    /**
     * Update is_received column(set false) in the user_notification table;
     */
    public async markAsUnreadMessages(userId : number) : Promise<void> {
        await this.sqlNot`UPDATE ${this.sqlLic(userNotifications.tableName)}
                       SET ${this.sqlLic(userNotifications.columns.isReceived)} = false
                       WHERE ${this.sqlLic(userNotifications.columns.userId)} = ${userId}`;
    }
    /**
     * Get notification user role Id
     */
    public async getUserRoleId(userId : number) : Promise<[{user_id : number}]> {
        return this.sqlNot`SELECT ${this.sqlNot(workUsers.columns.roleId)}
                           FROM ${this.sqlNot(workUsers.notificationTableName)}
                           WHERE ${this.sqlNot(workUsers.columns.userId)} = ${userId}`;
    }
    /**
     * Create a user in the notification module system
     */
    public async insertNotificationUser(userId : number) : Promise<void> {
        await this.sqlNot`INSERT INTO ${this.sqlNot(workUsers.notificationTableName)}
                          (${this.sqlNot(workUsers.columns.userId)},
                           ${this.sqlNot(workUsers.columns.roleId)},
                           ${this.sqlNot(workUsers.columns.isActive)})
                          VALUES
                          (${userId}, ${NotificationRoles.admin}, ${true})`;
    }
    /**
     * Set "Administrator" role for user
     */
    public async setAdminRole(userId : number) : Promise<void> {
        await this.sqlNot`UPDATE ${this.sqlNot(workUsers.notificationTableName)}
                          SET ${this.sqlNot(workUsers.columns.roleId)} = ${NotificationRoles.admin}
                          WHERE ${this.sqlNot(workUsers.columns.userId)} = ${userId}`;
    }
    /**
     * Close connect to databases
     */
    public async closeConnect() : Promise<void> {
        await this.sqlLic.end();
        await this.sqlNot.end();
    }
}