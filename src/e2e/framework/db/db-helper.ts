import postgres from "postgres";

export class DbHelper {
   private readonly sql : postgres.Sql<Record<string, postgres.PostgresType> extends {} ? {} : any>
    constructor() {
       this.sql = postgres({
               host : "rfs-db-01.fors.ru",
               port : 5432,
               database : "rfs_lic_test",
               username : "rfs_lic_test",
               password : "W8IYunN5YmLdd9L"
           })
    }
    public async delete(table : string,column : string,data : number | string) : Promise<void> {
       await this.sql`delete from ${this.sql(table)} where ${this.sql(column)} = ${data}`
    }
}