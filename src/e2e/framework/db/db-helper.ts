import postgres from "postgres";
import fs from "fs";

export class DbHelper {
   private readonly sql : postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
       this.sql = postgres(this.configData())
    }
    /**
     * Удалить данные из таблиц
     */
    public async delete(table : string,column : string,data : number | string) : Promise<void> {
       await this.sql`delete from ${this.sql(table)} where ${this.sql(column)} = ${data}`
    }
    /**
     * Получить содержимое файла db.config.json
     */
    public configData() : object {
       return JSON.parse(fs.readFileSync("./src/e2e/framework/db/db.config.json","utf-8"));
    }
}