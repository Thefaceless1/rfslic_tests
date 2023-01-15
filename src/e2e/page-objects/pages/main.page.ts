import {BasePage} from "./base.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {MainMenuOptions} from "../helpers/enums/main-menu-options.js";

export class MainPage extends BasePage {
    constructor(page : Page) {
        super(page);
    }
    public menuOptionByEnum (enumValue : MainMenuOptions) : Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'HomePage_title') and text()='${enumValue}']`);
    }
    public async clickOnMenuOption (menuOption : MainMenuOptions) : Promise<void> {
        await this.menuOptionByEnum(menuOption).click();
    }
}