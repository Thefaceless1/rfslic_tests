import {Prolicense} from "../prolicense";
import {beforeAll} from "@jest/globals";
import {License} from "../license";
import {Admin} from "../admin";
import {Commission} from "../commission";

export class Hooks {
    /**
     * Actions before all tests in 'prolicense.test.ts' file
     */
    public static beforeProlic(prolicense: Prolicense): void {
        beforeAll(async () => {
            await prolicense.authorize();
            await prolicense.uploadFiles();
            await prolicense.fillCatalogsData();
        })
    }
    /**
     * Actions before all tests in 'license.test.ts' file
     */
    public static beforeLicense(license: License): void {
        beforeAll(async () => {
            await license.authorize();
            await license.uploadFiles();
            await license.fillCatalogsData();
            await license.createProlicense();
            await license.createCriteriaGroups();
            await license.createCriterias();
            await license.publishProlicense();
        })
    }
    /**
     * Actions before all tests in 'admin.test.ts' file
     */
    public static beforeAdmin(admin: Admin): void {
        beforeAll(async () => {
            await admin.authorize();
            await admin.fillCatalogsData();
            await admin.checkUser();
        })
    }
    /**
     * Actions before all tests in 'commission.spec.ts' file
     */
    public static beforeCommission(commission: Commission): void {
        beforeAll(async () => {
            await commission.authorize();
            await commission.uploadFiles();
            await commission.fillCatalogsData();
        })
    }
}