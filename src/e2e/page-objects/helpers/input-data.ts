import {randomInt} from "crypto";

export class InputData {
    /**
     * Get current date
     */
    public static currentDate  : string = new Date().toLocaleDateString();
    /**
     * Current module version
     */
    public static moduleVersion  : string = "9.1.2.1";
    /**
     * Future date
     */
    public static get futureDate() : string {
        return new Date(Date.now() + 5000000000).toLocaleDateString();
    }
    /**
     * Random set of letters
     */
    public static get randomWord() : string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        while (randomWord.length < 20) {
            randomWord += alphabet[randomInt(0, alphabet.length)];

        }
        return randomWord;
    }
}