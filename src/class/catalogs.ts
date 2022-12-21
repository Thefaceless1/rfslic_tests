export class Catalogs {
    public static seasons: TCurrentSeason[] = [];
    public static criteriaGroups: TCriteriaGroups[] = [];
    public static licTypes: TLicTypes[] = [];
    public static docTypes: TDocTypes[] = [];
    public static rankCriteria : TRankCriteria[] =[];
    public static criteriaTypes : TCriteriaTypes[] =[];
    public static licStatus : TLicAndDocStatus[] =[];
    public static docStatus : TLicAndDocStatus[] =[];
}
export type TCurrentSeason = {
    id: number,
    current: boolean,
    dateStart: string,
    dateEnd: string,
    name: string
}
export type TCriteriaGroups = {
    id:number,
    name : string
}

export type TLicTypes = {
    id : number,
    name : string,
    sysName : string,
    description : string
}
export type TDocTypes = {
    id: number,
    name : string,
    description : string
}
export type TRankCriteria = {
    id : number,
    code : string,
    description : string
}
export type TCriteriaTypes = {
    id : number,
    name : string,
    description : string
}
export type TLicAndDocStatus = {
    id: number,
    name: string,
    description: string
}