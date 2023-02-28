import {randomInt} from "crypto";
import {TLicAndDocStatus, TRankCriteria} from "./catalogs";

export class TestData {
    //public static files: TFiles[] = [];
    public static readonly commentValue : string = "Тестовый комментарий";
    public static readonly descValue : string = "Тестовое описание";
    /**
     * Current date
     */
    public static get currentDate () : string {
        return new Date().toLocaleDateString().split(".").reverse().join("-");
    }
    /**
     * Future date
     */
    public static get futureDate () : string {
        return new Date(Date.now() + 5000000000).toLocaleDateString().split(".").reverse().join("-");
    }
    /**
     * Random letters
     */
    public static get randomWord () : string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        while (randomWord.length < 20) {
            randomWord += alphabet[randomInt(0, alphabet.length)];

        }
        return randomWord;
    }
    /**
     * Get random criteria rank "code"
     */
    public static randomCode(criteriaRanks : TRankCriteria[]) : string {
        const symbols : string = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";
        const randomNumber : number = randomInt(0,symbols.length);
        const codes : string[] = criteriaRanks.map(rank => rank.code);
        return (codes.includes(symbols[randomNumber])) ?
            this.randomCode(criteriaRanks) :
            symbols[randomNumber];
    }
    /**
     * Get random number for the 'Minimum quantity' field
     */
    public static get randomIntForMulti () : number {
        return randomInt(2,10);
    }
    /**
     * Get a random number for the 'Document status' field
     */
    public static randomIntForDocStat (docStatus : TLicAndDocStatus[]) : number {
        return randomInt(0,docStatus.length);
    }
}
export type TFiles = {
    name : string,
    storageId : string
}