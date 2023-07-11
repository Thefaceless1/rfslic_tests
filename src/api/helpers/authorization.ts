import {DbHelper} from "../../db/db-helper";
import superagent from "superagent";
import {operationsLog, roles, workUsers} from "../../db/tables";
import {UserApi} from "./api/user.api";

export class Authorization {
    public cookie: string = ''
    public x_csrf_token: string = ''
    constructor(
        private readonly userNumber: number = 0
    ) {}
    /**
     * Create a user
     */
    public async authorize(): Promise<void> {
        const dbHelper = new DbHelper();
        const userData = await superagent.get(UserApi.activeUsers).
        query({pageNum: 0, pageSize: 10});
        const userId = userData.body.data[this.userNumber].id;
        const dbUserData = await dbHelper.select(workUsers.tableName,workUsers.columns.userId,userId);
        const dbAdminData = await dbHelper.select(roles.tableName,roles.columns.name,"Администратор");
        if (dbUserData[0][workUsers.columns.roleId] != dbAdminData[0][roles.columns.id]) {
            await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,userId);
            await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,userId);
            await dbHelper.insertUser(userId);
            await dbHelper.insertUserRights(userId);
        }
        await dbHelper.closeConnect();
        const response = await superagent.get(UserApi.currentUser);
        const sessionId: string = response.header['set-cookie'][1].match(/^.+?(?=;)/)[0];
        const xCsrfToken: string = response.header['set-cookie'][0].match(/^.+?(?=;)/)[0];
        const xCsrfTokenValue: string = xCsrfToken.match(/(?<==).+/)![0];
        this.cookie = xCsrfToken + "; " + sessionId;
        this.x_csrf_token = xCsrfTokenValue
        await superagent.put(UserApi.setUser(userId)).
        set('cookie',this.cookie).
        set('x-csrf-token',this.x_csrf_token);
    }
}