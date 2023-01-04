import {BaseElement} from "./base-element.js";
import {ElementHandle, Locator, Page} from "@playwright/test";
import {InputData} from "../helpers/input-data.js";

export class Date extends BaseElement {
    /**
     * Заполнение поля с типом Date
     */
    public static async fillDateInput (element: Locator) {
        await element.clear()
        await element.type(InputData.todayDate);
        await element.press("Enter");
    }
}