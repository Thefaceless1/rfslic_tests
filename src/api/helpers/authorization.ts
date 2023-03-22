import {DbHelper} from "../../db/db-helper";
import {Api} from "./api";
import superagent from "superagent";
import {operationsLog, roles, workUsers} from "../../db/tables";

export class Authorization {
    public cookie : string = ''
    constructor(
        private readonly userNumber : number = 0
    ) {}
    /**
     * Create a user
     */
    public async authorize() : Promise<void> {
        const dbHelper = new DbHelper();
        const api = new Api();
        const userData = await superagent.get(api.basicUrl + api.user.activeUsers).
        query({pageNum : 0, pageSize : 10});
        const userId = userData.body.data[this.userNumber].id;
        const dbUserData = await dbHelper.select(workUsers.tableName,workUsers.columns.userId,userId);
        const dbAdminData = await dbHelper.select(roles.tableName,roles.columns.name,"Администратор");
        if (dbUserData[0][workUsers.columns.roleId] != dbAdminData[0][roles.columns.id]) {
            await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,userId);
            await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,userId);
            await dbHelper.insertUser(userId);
            await dbHelper.insertUserRights(userId);
        }
        await dbHelper.sql.end();
        api.user.fillApi(userId);
        const setUserData = await superagent.put(api.basicUrl + api.user.setUser);
        const regExp : RegExp = /^.+?(?=;)/;
        this.cookie = setUserData.header['set-cookie'][0].match(regExp)[0];
    }
}