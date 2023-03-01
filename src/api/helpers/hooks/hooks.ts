import {Prolicense} from "../prolicense";
import {afterEach, beforeAll} from "@jest/globals";
import {Api} from "../api";
import {License} from "../license";
import {Admin} from "../admin";
import {Commission} from "../commission";

export class Hooks {
    /**
     * Actions before all tests in 'prolicense.test.ts' file
     */
    public static beforeProlic(prolicense : Prolicense) : void {
        beforeAll(async () => {
            await prolicense.authorize();
            await prolicense.uploadFiles();
            await prolicense.fillCatalogsData();
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
    public static beforeLicense(license : License,api : Api) : void {
        beforeAll(async () => {
            await license.authorize();
            await license.uploadFiles();
            await license.fillCatalogsData();
            await license.createTestProlicense();
            await api.constructors.fillApi(license.prolicense);
            await license.createTestCriterias(api);
        })
    }
    /**
     * Actions before all tests in 'admin.test.ts' file
     */
    public static beforeAdmin(admin : Admin) : void {
        beforeAll(async () => {
            await admin.authorize();
            await admin.fillCatalogsData();
            await admin.checkUser();
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
     * Actions before all tests in 'commission.page.spec.ts' file
     */
    public static beforeCommission(commission : Commission) : void {
        beforeAll(async () => {
            await commission.authorize();
            await commission.uploadFiles();
            await commission.fillCatalogsData();
        })
    }
    /**
     * Actions after each test in 'commission.page.spec.ts' file
     */
    public static afterEachCommission(api : Api, commission : Commission) : void {
        afterEach(() => {
            api.commissions.fillApi(commission);
        })
    }
}