import {Locator, Page} from "@playwright/test";
import {ConstructorNewPage} from "./constructor-new.page.js";
import {Elements} from "../../framework/elements/elements.js";
import {Pages} from "../helpers/enums/pages.js";
import {Columns} from "../helpers/enums/columns.js";
import {Input} from "../../framework/elements/input.js";
import {InputData} from "../helpers/input-data.js";
import {MainPage} from "./main.page.js";

export class RequestNewPage extends MainPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Button "->" in the left corner of the table
     */
    private arrow  : Locator = Elements.getElement(this.page,"(//td[contains(@class,'fix-left')]/button)[1]");

    /**
     * Button "Go to request"
     */
    private goToRequest : Locator = Elements.getElement(this.page,"//span[text()='Перейти к заявке']");
    /**
     * Button "Publish a request"
     */
    private publishReqButton : Locator = Elements.getElement(this.page,"//button[text()='Подать заявку']");
    /**
     * Field "Select a club"
     */
    private selectClub : Locator = Elements.getElement(this.page,"//*[contains(@class,'club__control')]");
    /**
     * Values of the drop-down list of the field "Select a club"
     */
    private selectClubList : Locator = Elements.getElement(this.page,"//*[contains(@class,'club__option')]");
    /**
     * Page title "Request for club licensing"
     */
    public requestTitle : Locator = Elements.getElement(this.page,"//*[text()='Заявка на лицензирование клуба']");
    /**
     * Select a club from the drop down list of values
     */
    public async chooseClub() : Promise<void> {
        await Elements.waitForVisible(this.selectClub);
        await this.selectClub.click();
        await Elements.waitForVisible(this.selectClubList.first());
        await this.selectClubList.first().click();
    }
    /**
     * Create a prolicense with filled criteria groups and criterias
     */
    public async createTestProlicense() : Promise<void> {
        const constructor = new ConstructorNewPage(this.page);
        await constructor.openConstructor();
        await constructor.createProlicense();
        await constructor.createGrpCrit();
        await constructor.createCriteria();
        this.prolicenseName = await constructor.createdProlicName.innerText();
        await constructor.publishProlicense("lic");
        await constructor.page.waitForNavigation({url : Pages.constructorPage,waitUntil : "domcontentloaded"});
    }
    /**
     * Create a request in the status "Draft"
     */
    public async createDraft() : Promise<void> {
        await this.arrow.click();
        await this.goToRequest.click();
    }
    /**
     * Publish a license
     */
    public async publishLic(): Promise<void> {
        await Elements.waitForVisible(this.plusButton.last());
        const iterationCount : number = await this.plusButton.count();
        for(let i = 0; i<iterationCount; i++) {
            await this.plusButton.nth(i).click();
            await this.fillDocsAndComment();
        }
        await this.publishReqButton.click();
    }
    /**
     * Create a test request
     */
    public async createTestLic() : Promise<void> {
        await this.goto(Pages.requestNewPage);
        await this.chooseClub();
        await this.filterByColumn(this.filterButtonByEnum(Columns.licName));
        await this.createDraft();
        await this.publishLic();
    }
    /**
     * Add files and comments for license documents
     */
    protected async fillDocsAndComment () : Promise<void> {
        await Input.uploadFiles(this.templates.first());
        await Elements.waitForVisible(this.docIcon);
        await Elements.waitForVisible(this.xlsxIcon);
        await this.comment.type(InputData.randomWord);
        await this.addButton.click();
    }
}