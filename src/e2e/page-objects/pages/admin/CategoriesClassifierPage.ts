import {MainPage} from "../MainPage.js";
import {expect, Locator, Page} from "@playwright/test";
import {Elements} from "../../../framework/elements/Elements.js";
import {randomInt} from "crypto";
import {InputData} from "../../helpers/InputData.js";
import {Notifications} from "../../helpers/enums/Notifications.js";

export class CategoriesClassifierPage extends MainPage {
    constructor(page: Page) {
        super(page);
    }
    /**
     * Button "Add a rank"
     */
    private addRankButton: Locator = Elements.getElement(this.page,"//button[text()='Добавить разряд']")
    /**
     * Field "Enter a code"
     */
    private enterCode: Locator = Elements.getElement(this.page,"//input[@placeholder='Введите код' or @placeholder='Код']")
    /**
     * column "Code"
     */
    private codeColumn: Locator = Elements.getElement(this.page,"//td[contains(@class,'codeWrapperCell')]")
    /**
     * Add a category
     */
    public async addCategory(): Promise<void> {
        await Elements.waitForVisible(this.codeColumn.first());
        const existingCodes : string[] =await this.codeColumn.allInnerTexts();
        await this.addRankButton.click();
        await this.enterCode.type(this.nonExistentCode(existingCodes));
        await this.description.type(InputData.randomWord)
        await this.saveButton.click();
        await expect(this.notification(Notifications.categoryAdded)).toBeVisible();
    }
    /**
     * Get non-existent code
     */
    private nonExistentCode(codes: string[]): string {
        const symbols : string = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
        const randomNumber : number = randomInt(0,symbols.length);
        return (codes.includes(symbols[randomNumber])) ?
            this.nonExistentCode(codes) :
            symbols[randomNumber];
    }
    /**
     * Change a category
     */
    public async changeCategory(): Promise<void> {
        await Elements.waitForVisible(this.editTableButton.first());
        const existingCodes : string[] =await this.codeColumn.allInnerTexts();
        await this.editTableButton.last().click();
        await this.enterCode.clear();
        await this.enterCode.type(this.nonExistentCode(existingCodes));
        await this.description.clear();
        await this.description.type(InputData.randomWord);
        await this.saveButton.click();
        await expect(this.notification(Notifications.categoryChanged)).toBeVisible();
    }
    /**
     * Delete a category
     */
    public async deleteCategory(): Promise<void> {
        await Elements.waitForVisible(this.deleteTableButton.first());
        const createdCode : string = await this.codeColumn.last().innerText();
        const pendingNotification : string = `Разряд "${createdCode}" удален`;
        await this.deleteTableButton.last().click();
        await this.deleteButton.click();
        await expect(this.notification(pendingNotification)).toBeVisible();
    }
}