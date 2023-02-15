import {MainPage} from "./main.page.js";
import {Locator, Page} from "@playwright/test";
import {AdminOptions} from "../helpers/enums/admin-options.js";
import {Elements} from "../../framework/elements/elements.js";
import {InputData} from "../helpers/input-data.js";

export class LicTextPage extends MainPage{
    constructor(page : Page) {
        super(page);
    }
    /**
     * Text field "Enter a text"
     */
    private enterText : Locator = Elements.getElement(this.page,"//textarea[@placeholder='Введите текст']");
    /**
     * Add license text
     */
    public async addLicText() : Promise<void> {
        await this.adminMenuByEnum(AdminOptions.licenseText).click();
        await this.licType.click();
        await Elements.waitForVisible(this.licenseTypes.first());
        await this.licenseTypes.first().click();
        await this.enterText.clear();
        await this.enterText.type(InputData.randomWord);
        await this.saveButton.click();
    }
}