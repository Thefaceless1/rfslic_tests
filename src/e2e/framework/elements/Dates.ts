import {Elements} from "./Elements.js";
import {Locator} from "@playwright/test";

export class Date extends Elements {
    /**
     * Fill a field with "Date" type
     */
    public static async fillDateInput(element: Locator, inputData: string): Promise<void> {
        await element.clear()
        await element.type(inputData);
        await element.press("Enter");
    }
}