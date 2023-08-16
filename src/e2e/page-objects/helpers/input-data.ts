import {randomInt} from "crypto";
import {dateConfig} from "./date.config.js";

export class InputData {
    /**
     * Get current date
     */
    public static currentDate: string = new Date().toLocaleDateString('ru-RU')
    /**
     * Test annotation date
     */
    public static testAnnotationDate: string = new Date().toLocaleString('ru-RU',dateConfig)
    /**
     * Future date
     */
    public static get futureDate(): string {
        const millisecondsInOneDay = 24 * 60 * 60 * 1000;
        const daysToAdd = 10;
        return new Date(Date.now() + (millisecondsInOneDay * daysToAdd)).toLocaleDateString();
    }
    /**
     * Random set of letters
     */
    public static get randomWord(): string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        const wordLength: number = 20;
        while(randomWord.length < wordLength) {
            randomWord += alphabet[randomInt(0, alphabet.length)];
        }
        return randomWord;
    }
}