import {Prolicense} from "../prolicense";
import {Criterias} from "../criterias";
import {TestData} from "../test-data";
import {afterEach, beforeAll} from "@jest/globals";
import {Api} from "../api";
import {License} from "../license";
import {DbHelper} from "../../../e2e/framework/db/db-helper";
import {operationsLog, workUsers} from "../../../e2e/framework/db/tables";
import {Admin} from "../admin";
import {Commission} from "../commission";

export class Hooks {
    /**
     * Actions before all tests in 'prolicense.test.ts' file
     */
    public static beforeProlic(prolicense : Prolicense,criterias : Criterias) : void {
        beforeAll(async () => {
            await TestData.uploadFiles();
            await prolicense.catalogs.fillCatalogsData();
            await criterias.catalogs.fillCatalogsData();
        })
    }
    /**
     * Actions after each test in 'prolicense.test.ts' file
     */
    public static afterEachProlic(prolicense : Prolicense, api : Api) : void {
        afterEach(() => api.constructors.fillApi(prolicense.prolicense));
    }
    /**
     * Actions before all tests in 'license.test.ts' file
     */
    public static beforeLicense(prolicense : Prolicense, license : License,criterias : Criterias,api : Api) : void {
        beforeAll(async () => {
            await TestData.uploadFiles();
            await license.catalogs.fillCatalogsData();
            await prolicense.catalogs.fillCatalogsData();
            await criterias.catalogs.fillCatalogsData();
            await prolicense.createTestProlicense();
            await api.constructors.fillApi(prolicense.prolicense);
            await criterias.createTestCriterias(api);
        })
    }
    /**
     * Actions before all tests in 'admin.test.ts' file
     */
    public static beforeAdmin(admin : Admin) : void {
        beforeAll(async () => {
            await admin.catalogs.fillCatalogsData();
            const dbHelper = new DbHelper();
            await dbHelper.delete(operationsLog.tableName,operationsLog.columns.userId,admin.catalogs.clubWorkersId[0]);
            await dbHelper.delete(workUsers.tableName,workUsers.columns.userId,admin.catalogs.clubWorkersId[0]);
            await dbHelper.sql.end();
        })
    }
    /**
     * Actions after each test in 'admin.test.ts' file
     */
    public static afterEachAdmin(api : Api, admin : Admin) : void {
        afterEach(() => {
            api.admin.fillApi(admin);
        })
    }
    /**
     * Actions before all tests in 'commission.test.ts' file
     */
    public static beforeCommission(commission : Commission) : void {
        beforeAll(async () => {
            await TestData.uploadFiles();
            await commission.catalogs.fillCatalogsData();
        })
    }
    /**
     * Actions after each test in 'commission.test.ts' file
     */
    public static afterEachCommission(api : Api, commission : Commission) : void {
        afterEach(() => {
            api.commissions.fillApi(commission);
        })
    }
}