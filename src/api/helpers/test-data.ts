import {randomInt} from "crypto";
import {Catalogs, TDocTypes} from "../class/catalogs";
import {Api} from "./api";
import {FileReader} from "./file-reader";
import superagent from "superagent";

export class TestData {
    public static files: TFiles[] = [];
    public static readonly commentValue : string = "Тестовый комментарий";
    public static readonly descValue : string = "Тестовое описание";
    public static get todayDate () : string {
        return new Date().toLocaleDateString().split(".").reverse().join("-");
    }
    public static get futureDate () : string {
        return new Date(Date.now() + 5000000000).toLocaleDateString().split(".").reverse().join("-");
    }
    public static get randomWord () : string {
        const alphabet: string = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let randomWord: string = "автотест|";
        while (randomWord.length < 20) {
            randomWord += alphabet[randomInt(0, alphabet.length)];

        }
        return randomWord;
    }
    private static addDataToFiles (name : string, id: string) : void {
        this.files.push({name : name, storageId : id})
    }
    public static async uploadFiles() {
        if (this.files.length == FileReader.fileNames.length) return;
        const api = new Api();
        for (const fileName of FileReader.fileNames) {
            const files = await superagent.post(api.basicUrl + api.upload.upload).
            set("Content-Type", "multipart/form-data; boundary=----WebKitFormBoundaryoI4AK63JZr8jUhAa").
            attach("file", FileReader.fileDir + fileName);
            TestData.addDataToFiles(fileName,files.body.data);
        }
    }
    public static get randomIntForMulti () : number {
        const randomNumb : number = randomInt(-1,6);
        return (randomNumb >- 1 && randomNumb <= 1) ? this.randomIntForMulti : randomNumb;
    }
    public static randomIntForDocs (docTypes : TDocTypes[]) : number {
        return randomInt(0,docTypes.length);
    }
}
export type TFiles = {
    name : string,
    storageId : string
}