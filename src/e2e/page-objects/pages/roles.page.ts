import {MainPage} from "./main.page.js";
import {Locator, Page} from "@playwright/test";
import {Elements} from "../../framework/elements/elements.js";
import {InputData} from "../helpers/input-data.js";

export class RolesPage extends MainPage {
    constructor(page : Page) {
        super(page);
    }
    /**
     * Поле "Выберите роль"
     */
    private selectRole : Locator = Elements.getElement(this.page,"//*[contains(@class,'role__control')]");
    /**
     * Значения выпадающего списка поля "Выберите роль"
     */
    private rolesList : Locator = Elements.getElement(this.page,"//*[contains(@class,'role__option')]");
    /**
     * Кнопка "Сохранить как"
     */
    private saveAsButton : Locator = Elements.getElement(this.page,"//button[text()='Сохранить как...']");
    /**
     * Поле "Название роли"
     */
    private enterRole : Locator = Elements.getElement(this.page,"//input[@placeholder='Введите название роли']");
    /**
     * Поле "Описание роли"
     */
    private roleDescription : Locator = Elements.getElement(this.page,"//textarea[@placeholder='Введите описание роли']");
    /**
     * Добавить роль
     */
    public async addRole() : Promise<void> {
        await this.selectRole.click();
        await Elements.waitForVisible(this.rolesList.first());
        await this.rolesList.first().click();
        await Elements.waitForVisible(this.saveAsButton);
        await this.saveAsButton.click();
        await Elements.waitForVisible(this.enterRole);
        await this.enterRole.clear();
        await this.enterRole.type(InputData.randomWord);
        await this.roleDescription.clear()
        await this.roleDescription.type(InputData.randomWord);
        await this.saveButton.last().click();
    }
    /**
     * Изменение прав роли
     */
    public async changeRoleRights() : Promise<void> {
        const checkboxCount : number = await this.checkbox.count()-1;
        for(let i = 1; i<checkboxCount;i++) {
            if(i%2 == 0) await this.checkbox.nth(i).click();
        }
        await this.saveButton.click();
    }
    /**
     * Удаление роли
     */
    public async deleteRole() : Promise<void> {
        await this.deleteButton.click();
        await this.deleteButton.last().click();
    }
}