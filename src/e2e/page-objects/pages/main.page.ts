import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {MainMenuOptions} from "../helpers/enums/main-menu-options.js";
import {AdminOptions} from "../helpers/enums/admin-options.js";
import {AuthPage} from "./auth.page.js";

export class MainPage extends AuthPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Получить значения пунктов меню главной страницы по enum
     */
    public menuOptionByEnum (menuOption : MainMenuOptions) : Locator {
        return Elements.getElement(this.page,`//*[contains(@class,'HomePage_title') and text()='${menuOption}']`);
    }
    /**
     * Получить значения пунктов меню блока "Администрирование" по enum
     */
    public adminMenuByEnum (menuOption : AdminOptions) : Locator {
        return Elements.getElement(this.page,`//*[text()='${menuOption}']`);
    }
}