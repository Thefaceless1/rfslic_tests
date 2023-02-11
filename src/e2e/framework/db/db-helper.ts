import postgres from "postgres";
import fs from "fs";

export class DbHelper {
   public readonly sql : postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
       this.sql = postgres(this.configData())
    }
    /**
     * Delete data from tables
     */
    public async delete(table : string,column : string,data : number | string) : Promise<void> {
       await this.sql`delete from ${this.sql(table)} where ${this.sql(column)} = ${data}`;
    }
    /**
     * Select data from tables
     */
    public async select(table : string,column : string,data : number | string | boolean) : Promise<postgres.RowList<postgres.Row[]>> {
        return this.sql`select * from ${this.sql(table)} where ${this.sql(column)} = ${data}`
    }
    /**
     * db.config.json file parser
     */
    public configData() : object {
       return JSON.parse(fs.readFileSync("./src/e2e/framework/db/db.config.json","utf-8"));
    }
}