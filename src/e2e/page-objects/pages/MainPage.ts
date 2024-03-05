import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/Elements.js";
import {MainMenuOptions} from "../helpers/enums/MainMenuOptions.js";
import {AdminOptions} from "../helpers/enums/AdminOptions";
import {AuthPage} from "./AuthPage.js";
import {CommissionMenuOptions} from "../helpers/enums/CommissionMenuOptions";

export class MainPage extends AuthPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Get main page menu item values by enum
     */
    public menuOptionByEnum (menuOption: MainMenuOptions): Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'HomePage_title') and text()='${menuOption}']`);
    }
    /**
     * Get the values of the menu items of the "Administration" block by enum
     */
    public adminMenuByEnum (menuOption: AdminOptions): Locator {
        return Elements.getElement(this.page,`//*[text()='${menuOption}']`);
    }
    /**
     * Get the values of the menu items of the "Commission" block by enum
     */
    public commissionMenuByEnum (menuOption: CommissionMenuOptions): Locator {
        return Elements.getElement(this.page,`//*[text()='${menuOption}']`);
    }
}