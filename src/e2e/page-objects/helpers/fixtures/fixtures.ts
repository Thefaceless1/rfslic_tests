import {test as base} from '@playwright/test';
import {ConstructorNewPage} from "../../pages/constructor-new.page.js";
import {Pages} from "../enums/pages.js";
import {RequestNewPage} from "../../pages/request-new.page.js";
import {RequestPage} from "../../pages/request.page.js";
import {Columns} from "../enums/columns.js";
import {RolesPage} from "../../pages/roles.page.js";
import {AdminOptions} from "../enums/admin-options.js";
import {UsersPage} from "../../pages/users.page.js";
import {AuthPage} from "../../pages/auth.page.js";

type Fixtures = {
    setUser : AuthPage,
    constructor : ConstructorNewPage,
    newRequest :  RequestNewPage,
    requests : RequestPage,
    roles : RolesPage,
    users : UsersPage
}
export const test = base.extend<Fixtures>({
    constructor : async ({page},use) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.login();
        await constructor.openConstructor();
        await constructor.createProlicense();
        await use(constructor);
    },
    newRequest : async ({page},use) => {
        const newRequest = new RequestNewPage(page);
        await newRequest.login();
        await newRequest.createTestProlicense();
        await newRequest.goto(Pages.requestNewPage);
        await newRequest.chooseClub();
        await newRequest.filterByColumn(newRequest.filterButtonByEnum(Columns.licName));
        await use(newRequest);
    },
    requests : async ({page},use) => {
        const request = new RequestPage(page);
        await request.login();
        await request.createTestProlicense();
        await request.createTestLic();
        await request.openPublishedLic();
        await use(request);
    },
    roles : async ({page},use) => {
        const roles = new RolesPage(page);
        await roles.login();
        await roles.adminMenuByEnum(AdminOptions.roles).click();
        await use(roles);
        await roles.deleteRole();
    },
    users : async ({page},use) => {
        const users = new UsersPage(page);
        await users.login();
        await users.deleteUser();
        await users.adminMenuByEnum(AdminOptions.users).click();
        await use(users);
    },
    setUser : async ({browser},use) => {
        const page = await browser.newPage();
        const authPage = new AuthPage(page);
        await use(authPage);
        await page.close();
    }
})