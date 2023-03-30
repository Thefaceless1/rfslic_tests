import {Elements} from "./elements.js";
import {Locator} from "@playwright/test";

export class Checkbox extends Elements {
    /**
     * Waiting to uncheck status for checkbox
     */
    public static async waitForUncheckedState(checkbox : Locator) : Promise<void> {
        if(await checkbox.isChecked()) await this.waitForUncheckedState(checkbox);
    }
}