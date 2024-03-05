import {MainPage} from "../MainPage.js";
import {expect, Locator, Page} from "@playwright/test";
import {AdminOptions} from "../../helpers/enums/AdminOptions.js";
import {Elements} from "../../../framework/elements/Elements.js";
import {InputData} from "../../helpers/InputData.js";

export class LicTextPage extends MainPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Text field "Enter a text"
     */
    private enterText: Locator = Elements.getElement(this.page,"//textarea[@placeholder='Введите текст']")
    /**
     * Add license text
     */
    public async addLicText(): Promise<void> {
        const text : string = InputData.randomWord;
        await this.adminMenuByEnum(AdminOptions.licenseText).click();
        await this.licType.click();
        await Elements.waitForVisible(this.rfsWomanLicType);
        await this.rfsWomanLicType.click();
        await this.enterText.clear();
        await this.enterText.type(text);
        await this.saveButton.click();
        expect(await this.enterText.textContent()).toBe(text);
    }
}