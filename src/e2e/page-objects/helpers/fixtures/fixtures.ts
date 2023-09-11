import {test as base} from '@playwright/test';
import {ConstructorNewPage} from "../../pages/constructor/constructor-new.page.js";
import {Pages} from "../enums/pages.js";
import {RequestPage} from "../../pages/request/request.page.js";
import {Columns} from "../enums/columns.js";
import {RolesPage} from "../../pages/admin/roles.page.js";
import {AdminOptions} from "../enums/admin-options.js";
import {UsersPage} from "../../pages/admin/users.page.js";
import {AuthPage} from "../../pages/auth.page.js";
import {LicTextPage} from "../../pages/admin/lictext.page.js";
import {CommissionPage} from "../../pages/commissions/commission.page.js";
import {CommissionMenuOptions} from "../enums/commission-menu-options.js";
import {GroupsClassifierPage} from "../../pages/admin/groups-classifier.page.js";
import {CategoriesClassifierPage} from "../../pages/admin/categories-classifier.page.js";
import * as Process from "process";

type Fixtures = {
    setUser: AuthPage,
    constructor: ConstructorNewPage,
    licRequests: RequestPage,
    finRequests: RequestPage,
    roles: RolesPage,
    users: UsersPage,
    licenseText: LicTextPage,
    commission: CommissionPage,
    groupClassifier: GroupsClassifierPage,
    categoriesClassifier: CategoriesClassifierPage
}
export const test = base.extend<Fixtures>({
    constructor: async ({page},use) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.createUser();
        await constructor.login();
        await constructor.openConstructor();
        await use(constructor);
        if(Process.env.BRANCH == "prod") {
            await constructor.deleteProdUser();
            await constructor.deleteProdProlicense();
        }
    },
    licRequests: async ({page},use) => {
        const request = new RequestPage(page);
        await request.createUser();
        await request.login();
        await request.createTestProlicense("lic");
        await request.goto(Pages.requestNewPage);
        await request.chooseClub();
        await request.filterByColumn(request.filterButtonByEnum(Columns.licName));
        await use(request);
        if(Process.env.BRANCH == "prod") {
            await request.deleteProdUser();
            await request.deleteProdLicense();
        }
    },
    finRequests: async ({page},use) => {
        const request = new RequestPage(page);
        await request.createUser();
        await request.login();
        await request.createTestProlicense("fin");
        await request.goto(Pages.requestNewPage);
        await request.chooseClub();
        await request.filterByColumn(request.filterButtonByEnum(Columns.licName));
        await use(request);
        if(Process.env.BRANCH == "prod") {
            await request.deleteProdUser();
            await request.deleteProdLicense();
        }
    },
    roles: async ({page},use) => {
        const roles = new RolesPage(page);
        await roles.createUser();
        await roles.login();
        await roles.adminMenuByEnum(AdminOptions.roles).click();
        await use(roles);
        if(Process.env.BRANCH == "prod") await roles.deleteProdUser();
    },
    users: async ({page},use) => {
        const users = new UsersPage(page);
        await users.createUser();
        await users.deleteTestedUser();
        await users.login();
        await users.adminMenuByEnum(AdminOptions.users).click();
        await use(users);
        if(Process.env.BRANCH == "prod") await users.deleteProdUser();
    },
    setUser: async ({browser},use) => {
        const page = await browser.newPage();
        const authPage = new AuthPage(page);
        await use(authPage);
        await page.close();
    },
    licenseText: async ({page},use) => {
        const licenseText = new LicTextPage(page);
        await licenseText.createUser();
        await licenseText.login();
        await use(licenseText);
        if(Process.env.BRANCH == "prod") await licenseText.deleteProdUser();
    },
    commission: async ({page},use) => {
        const commission = new CommissionPage(page);
        await commission.createUser();
        await commission.login();
        await commission.changeLicensesStatus();
        await commission.commissionMenuByEnum(CommissionMenuOptions.meetings).click();
        await use(commission);
    },
    groupClassifier: async ({page},use) => {
        const groupClassifier = new GroupsClassifierPage(page);
        await groupClassifier.createUser();
        await groupClassifier.login();
        await groupClassifier.adminMenuByEnum(AdminOptions.groupsClassifier).click();
        await use(groupClassifier);
        if(Process.env.BRANCH == "prod") await groupClassifier.deleteProdUser();
    },
    categoriesClassifier: async ({page},use) => {
        const categoriesClassifier = new CategoriesClassifierPage(page);
        await categoriesClassifier.createUser();
        await categoriesClassifier.login();
        await categoriesClassifier.adminMenuByEnum(AdminOptions.categoriesClassifier).click();
        await use(categoriesClassifier);
        if(Process.env.BRANCH == "prod") await categoriesClassifier.deleteProdUser();
    }
})