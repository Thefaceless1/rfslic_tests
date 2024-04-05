import {test as base} from '@playwright/test';
import {ConstructorNewPage} from "../../pages/constructor/ConstructorNewPage.js";
import {Pages} from "../enums/Pages.js";
import {RequestPage} from "../../pages/request/RequestPage.js";
import {TableColumn} from "../enums/TableColumn.js";
import {RolesPage} from "../../pages/admin/RolesPage.js";
import {AdminOptions} from "../enums/AdminOptions.js";
import {UsersPage} from "../../pages/admin/UsersPage.js";
import {AuthPage} from "../../pages/AuthPage.js";
import {LicTextPage} from "../../pages/admin/LictextPage.js";
import {CommissionPage} from "../../pages/commissions/CommissionPage.js";
import {CommissionMenuOptions} from "../enums/CommissionMenuOptions.js";
import {GroupsClassifierPage} from "../../pages/admin/GropsClassifierPage.js";
import {CategoriesClassifierPage} from "../../pages/admin/CategoriesClassifierPage.js";
import {SanctionTypesPage} from "../../pages/admin/SanctionTypesPage.js";
import {ViolationsPage} from "../../pages/admin/ViolationsPage.js";
import {SanctionsPage} from "../../pages/admin/SanctionsPage.js";
import {RulesClassifierPage} from "../../pages/admin/RulesClassifierPage.js";

type Fixtures = {
    setUser: AuthPage,
    constructor: ConstructorNewPage,
    licRequests: RequestPage,
    finRequests: RequestPage,
    certRequests: RequestPage,
    roles: RolesPage,
    users: UsersPage,
    licenseText: LicTextPage,
    commission: CommissionPage,
    groupClassifier: GroupsClassifierPage,
    categoriesClassifier: CategoriesClassifierPage,
    sanctionTypes: SanctionTypesPage,
    violations: ViolationsPage,
    sanctions: SanctionsPage,
    rulesClassifier: RulesClassifierPage
}
export const test = base.extend<Fixtures>({
    constructor: async ({page},use) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.deleteUser();
        await constructor.createUser();
        await constructor.login();
        await constructor.openConstructor();
        await use(constructor);
        await constructor.deleteCreatedDataFromDatabase();
    },
    licRequests: async ({page},use) => {
        const request = new RequestPage(page);
        await request.deleteUser();
        await request.createUser();
        await request.login();
        await request.createTestProlicense("lic");
        await request.goto(Pages.requestNewPage);
        await request.chooseClub();
        await request.filterByColumn(request.filterButtonByEnum(TableColumn.licName));
        await use(request);
        await request.deleteCreatedDataFromDatabase();
    },
    finRequests: async ({page},use) => {
        const request = new RequestPage(page);
        await request.deleteUser();
        await request.createUser();
        await request.login();
        await request.createTestProlicense("fin");
        await request.goto(Pages.requestNewPage);
        await request.chooseClub();
        await request.filterByColumn(request.filterButtonByEnum(TableColumn.licName));
        await use(request);
        await request.deleteCreatedDataFromDatabase();
    },
    certRequests: async ({page},use) => {
        const request = new RequestPage(page);
        await request.deleteUser();
        await request.createUser();
        await request.login();
        await request.createTestProlicense("cert");
        await request.goto(Pages.requestNewPage);
        await request.chooseClub();
        await request.filterByColumn(request.filterButtonByEnum(TableColumn.licName));
        await use(request);
        await request.deleteCreatedDataFromDatabase();
    },
    roles: async ({page},use) => {
        const roles = new RolesPage(page);
        await roles.deleteUser();
        await roles.createUser();
        await roles.login();
        await roles.adminMenuByEnum(AdminOptions.roles).click();
        await use(roles);
    },
    users: async ({page},use) => {
        const users = new UsersPage(page);
        await users.deleteUser();
        await users.createUser();
        await users.deleteTestedUser();
        await users.login();
        await users.adminMenuByEnum(AdminOptions.users).click();
        await use(users);
    },
    setUser: async ({browser},use) => {
        const page = await browser.newPage();
        const authPage = new AuthPage(page);
        await use(authPage);
        await page.close();
    },
    licenseText: async ({page},use) => {
        const licenseText = new LicTextPage(page);
        await licenseText.deleteUser();
        await licenseText.createUser();
        await licenseText.login();
        await use(licenseText);
    },
    commission: async ({page},use) => {
        const commission = new CommissionPage(page);
        await commission.deleteUser();
        await commission.createUser();
        await commission.login();
        await commission.changeLicensesStatus();
        await commission.commissionMenuByEnum(CommissionMenuOptions.meetings).click();
        await use(commission);
    },
    groupClassifier: async ({page},use) => {
        const groupClassifier = new GroupsClassifierPage(page);
        await groupClassifier.deleteUser();
        await groupClassifier.createUser();
        await groupClassifier.login();
        await groupClassifier.adminMenuByEnum(AdminOptions.groupsClassifier).click();
        await use(groupClassifier);
    },
    categoriesClassifier: async ({page},use) => {
        const categoriesClassifier = new CategoriesClassifierPage(page);
        await categoriesClassifier.deleteUser();
        await categoriesClassifier.createUser();
        await categoriesClassifier.login();
        await categoriesClassifier.adminMenuByEnum(AdminOptions.categoriesClassifier).click();
        await use(categoriesClassifier);
    },
    sanctionTypes: async ({page},use) => {
        const sanctionTypes = new SanctionTypesPage(page);
        await sanctionTypes.deleteUser();
        await sanctionTypes.createUser();
        await sanctionTypes.login();
        await sanctionTypes.adminMenuByEnum(AdminOptions.sanctionConstructor).click();
        await use(sanctionTypes);
        await sanctionTypes.deleteSanctionTypeFromDatabase();
    },
    violations: async ({page},use) => {
        const violations = new ViolationsPage(page);
        await violations.deleteUser();
        await violations.createUser();
        await violations.login();
        await violations.adminMenuByEnum(AdminOptions.sanctionConstructor).click();
        await use(violations);
        await violations.deleteViolationsFromDatabase();
    },
    sanctions: async ({page},use) => {
        const sanctions = new SanctionsPage(page);
        await sanctions.deleteUser();
        await sanctions.createUser();
        await sanctions.createViolation();
        await sanctions.login();
        await sanctions.adminMenuByEnum(AdminOptions.sanctionConstructor).click();
        await use(sanctions);
        await sanctions.deleteViolationAndSanctionFromDatabase();
    },
    rulesClassifier: async ({page},use) => {
        const rulesClassifier = new RulesClassifierPage(page);
        await rulesClassifier.deleteUser();
        await rulesClassifier.createUser();
        await rulesClassifier.login();
        await rulesClassifier.adminMenuByEnum(AdminOptions.rulesClassifier).click();
        await use(rulesClassifier);
        await rulesClassifier.deleteRulesFromDatabase();
    }
})