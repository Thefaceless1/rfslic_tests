import {test as base} from '@playwright/test';
import {ConstructorNewPage} from "../../pages/constructor-new.page.js";
import {Pages} from "../enums/pages.js";
import {RequestNewPage} from "../../pages/request-new.page.js";
import {RequestPage} from "../../pages/request.page.js";
import {Columns} from "../enums/columns.js";

type Fixtures = {
    constructor : ConstructorNewPage,
    newRequest :  RequestNewPage,
    requests : RequestPage
}
export const test = base.extend<Fixtures>({
    constructor : async ({page},use) => {
        const constructor = new ConstructorNewPage(page);
        await constructor.goto(Pages.mainPage);
        await constructor.openConstructor();
        await constructor.createProlicense();
        await use(constructor);
        await constructor.deleteProlicense();
    },
    newRequest : async ({page},use) => {
        const newRequest = new RequestNewPage(page);
        await newRequest.createTestProlicense();
        await newRequest.goto(Pages.requestNewPage);
        await newRequest.chooseClub();
        await newRequest.filterByColumn(newRequest.filterButtonByEnum(Columns.licName));
        await use(newRequest);
    },
    requests : async ({page},use) => {
        const request = new RequestPage(page);
        await request.createTestProlicense();
        await request.createTestLic();
        await request.openPublishedLic();
        await use(request);
    }
})