import {Prolicense} from "../../class/prolicense";
import {Criterias} from "../../class/criterias";
import {TestData} from "../test-data";
import {afterEach, beforeAll} from "@jest/globals";
import {Api} from "../api";
import {License} from "../../class/license";

export class Hooks {
    public static async beforeProlic(prolicense : Prolicense,criterias : Criterias) : Promise<void> {
        beforeAll(async () => {
            await TestData.uploadFiles();
            await prolicense.catalogs.fillCatalogsData();
            await criterias.catalogs.fillCatalogsData();
        })
    }
    public static afterEachProlic(prolicense : Prolicense, api : Api) : void {
        afterEach(() => api.fillProlicenseApi(prolicense.prolicense));
    }
    public static async beforeLicense(prolicense : Prolicense, license : License,criterias : Criterias,api : Api) : Promise<void> {
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
}