import {Elements} from "./elements.js";
import {Locator} from "@playwright/test";

export class Date extends Elements {
    /**
     * Заполнение поля с типом Date
     */
    public static async fillDateInput (element: Locator, inputData : string) {
        await element.clear()
        await element.type(inputData);
        await element.press("Enter");
    }
}