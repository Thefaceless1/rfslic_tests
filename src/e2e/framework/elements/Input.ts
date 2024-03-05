import {Locator} from "@playwright/test";
import {FileReader} from "../../page-objects/helpers/FileReader.js";
import {Elements} from "./Elements.js";

export class Input extends Elements {
    /**
     * Load test files in a field with type "input"
     */
    public static async uploadFiles(element: Locator, filesCount: "one" | "all"): Promise<void> {
        (filesCount == "all") ?
            await element.setInputFiles(FileReader.getTestFiles) :
            await element.setInputFiles(FileReader.getTestFiles[0]);
    }
}