import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/Elements.js";
import {MainMenuOptions} from "../helpers/enums/MainMenuOptions.js";
import {AdminOptions} from "../helpers/enums/AdminOptions";
import {AuthPage} from "./AuthPage.js";
import {InputData} from "../helpers/InputData.js";

export class MainPage extends AuthPage {
    public prolicName: string = InputData.randomWord;
    constructor(page: Page) {
        super(page);
    }
    /**
     * Get main page menu item values by enum
     */
    public menuOptionByEnum (menuOption: MainMenuOptions): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'HomePage-module') and text()='${menuOption}']`);
    }
    /**
     * Get the values of the menu items of the "Administration" block by enum
     */
    public adminMenuByEnum (menuOption: AdminOptions): Locator {
        return Elements.getElement(this.page,`//*[text()='${menuOption}']`);
    }
}