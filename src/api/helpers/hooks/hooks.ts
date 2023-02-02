import {Prolicense} from "../../class/prolicense";
import {Criterias} from "../../class/criterias";
import {TestData} from "../test-data";
import {afterEach, beforeAll} from "@jest/globals";
import {Api} from "../api";
import {License} from "../../class/license";
import {DbHelper} from "../../../e2e/framework/db/db-helper";
import {operationsLog, workUsers} from "../../../e2e/framework/db/tables";
import {Admin} from "../../class/admin";

export class Hooks {
    public static beforeProlic(prolicense : Prolicense,criterias : Criterias) : void {
        beforeAll(async () => {
            await TestData.uploadFiles();
            await prolicense.catalogs.fillCatalogsData();
            await criterias.catalogs.fillCatalogsData();
        })
    }
    public static afterEachProlic(prolicense : Prolicense, api : Api) : void {
        afterEach(() => api.fillProlicenseApi(prolicense.prolicense));
    }
    public static beforeLicense(prolicense : Prolicense, license : License,criterias : Criterias,api : Api) : void {
        beforeAll(async () => {
            await TestData.uploadFiles();
            await license.catalogs.fillCatalogsData();
            await prolicense.catalogs.fillCatalogsData();
            await criterias.catalogs.fillCatalogsData();
            await prolicense.createTestProlicense();
            await api.fillProlicenseApi(prolicense.prolicense);
            await criterias.createTestCriterias(api);
        })
    }
    public static beforeAdmin(admin : Admin) : void {
        beforeAll(async () => {
            await admin.catalogs.fillCatalogsData();
            const dbHelper = new DbHelper();
            await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,admin.catalogs.clubWorkersId[0]);
            await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,admin.catalogs.clubWorkersId[0]);
            await dbHelper.sql.end();
        })
    }
}