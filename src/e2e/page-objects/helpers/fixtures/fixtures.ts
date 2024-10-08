import {test as base} from '@playwright/test';
import {ConstructorNewPage} from "../../pages/constructor/ConstructorNewPage.js";
import {RequestPage} from "../../pages/request/RequestPage.js";
import {RolesPage} from "../../pages/admin/RolesPage.js";
import {UsersPage} from "../../pages/admin/UsersPage.js";
import {AuthPage} from "../../pages/AuthPage.js";
import {LicTextPage} from "../../pages/admin/LictextPage.js";
import {GroupsClassifierPage} from "../../pages/admin/GropsClassifierPage.js";
import {CategoriesClassifierPage} from "../../pages/admin/CategoriesClassifierPage.js";
import {SanctionTypesPage} from "../../pages/admin/SanctionTypesPage.js";
import {ViolationsPage} from "../../pages/admin/ViolationsPage.js";
import {SanctionsPage} from "../../pages/admin/SanctionsPage.js";
import {RulesClassifierPage} from "../../pages/admin/RulesClassifierPage.js";
import {FinalDocumentsGroupsPage} from "../../pages/admin/FinalDocumentsGroupsPage.js";

type Fixtures = {
    setUser: AuthPage,
    constructor: ConstructorNewPage,
    licRequests: RequestPage,
    finRequests: RequestPage,
    certRequests: RequestPage,
    roles: RolesPage,
    users: UsersPage,
    licenseText: LicTextPage,
    groupClassifier: GroupsClassifierPage,
    categoriesClassifier: CategoriesClassifierPage,
    sanctionTypes: SanctionTypesPage,
    violations: ViolationsPage,
    sanctions: SanctionsPage,
    rulesClassifier: RulesClassifierPage,
    finalDocumentsGroups: FinalDocumentsGroupsPage
}
export const test = base.extend<Fixtures>({
    constructor: async ({page},use) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.deleteUser();
        await constructor.createUser();
        await constructor.login();
        await constructor.createRuleForProlicense();
        await use(constructor);
        await constructor.deleteCreatedData();
    },
    licRequests: async ({page},use) => {
        const request = new RequestPage(page);
        await request.deleteUser();
        await request.createUser();
        await request.login();
        await request.createTestProlicense("lic");
        await use(request);
        await request.deleteCreatedData();
    },
    finRequests: async ({page},use) => {
        const request = new RequestPage(page);
        await request.deleteUser();
        await request.createUser();
        await request.login();
        await request.createTestProlicense("fin");
        await use(request);
        await request.deleteCreatedData();
    },
    certRequests: async ({page},use) => {
        const request = new RequestPage(page);
        await request.deleteUser();
        await request.createUser();
        await request.login();
        await request.createTestProlicense("cert");
        await use(request);
        await request.deleteCreatedData();
    },
    roles: async ({page},use) => {
        const roles = new RolesPage(page);
        await roles.deleteUser();
        await roles.createUser();
        await roles.login();
        await use(roles);
    },
    users: async ({page},use) => {
        const users = new UsersPage(page);
        await users.deleteUser();
        await users.createUser();
        await users.deleteTestedUser();
        await users.login();
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
    groupClassifier: async ({page},use) => {
        const groupClassifier = new GroupsClassifierPage(page);
        await groupClassifier.deleteUser();
        await groupClassifier.createUser();
        await groupClassifier.login();
        await use(groupClassifier);
        await groupClassifier.deleteCriteriaGroups();
    },
    categoriesClassifier: async ({page},use) => {
        const categoriesClassifier = new CategoriesClassifierPage(page);
        await categoriesClassifier.deleteUser();
        await categoriesClassifier.createUser();
        await categoriesClassifier.login();
        await use(categoriesClassifier);
        await categoriesClassifier.deleteCategoriesClassifiers();
    },
    sanctionTypes: async ({page},use) => {
        const sanctionTypes = new SanctionTypesPage(page);
        await sanctionTypes.deleteUser();
        await sanctionTypes.createUser();
        await sanctionTypes.login();
        await use(sanctionTypes);
        await sanctionTypes.deleteSanctionTypes();
    },
    violations: async ({page},use) => {
        const violations = new ViolationsPage(page);
        await violations.deleteUser();
        await violations.createUser();
        await violations.login();
        await use(violations);
        await violations.deleteViolations();
    },
    sanctions: async ({page},use) => {
        const sanctions = new SanctionsPage(page);
        await sanctions.deleteUser();
        await sanctions.createUser();
        await sanctions.deleteViolationAndSanction();
        await sanctions.createViolation();
        await sanctions.login();
        await use(sanctions);
        await sanctions.deleteViolationAndSanction();
    },
    rulesClassifier: async ({page},use) => {
        const rulesClassifier = new RulesClassifierPage(page);
        await rulesClassifier.deleteCreatedData();
        await rulesClassifier.deleteUser();
        await rulesClassifier.createUser();
        await rulesClassifier.login();
        await use(rulesClassifier);
        await rulesClassifier.deleteRules();
    },
    finalDocumentsGroups: async ({page},use)=> {
        const finalDocumentsGroups = new FinalDocumentsGroupsPage(page);
        await finalDocumentsGroups.deleteUser();
        await finalDocumentsGroups.createUser();
        await finalDocumentsGroups.login();
        await use(finalDocumentsGroups);
    }
})