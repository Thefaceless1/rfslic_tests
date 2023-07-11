export type TSeasons = {
    id: number,
    current: boolean,
    dateStart: string,
    dateEnd: string,
    name: string
}
export type TCriteriaGroups = {
    id: number,
    name: string
}

export type TLicTypes = {
    id: number,
    name: string,
    sysName: string,
    description: string
}
export type TDocTypes = {
    id: number,
    name: string,
    description: string
}
export type TRankCriteria = {
    id: number,
    code: string,
    description: string
}
export type TCriteriaTypes = {
    id: number,
    name: string,
    description: string
}
export type TLicAndDocStatus = {
    id: number,
    name: string,
    description: string
}
export type TClubWorkers = {
    id: number,
    rfsId: number,
    fio: string,
    firstName: string,
    middleName: string,
    lastName: string,
    birthDate: string,
    orgName: string,
    position: string,
    sportRole: string
}
export type TOfi = {
    geo_lat: string,
    geo_lon: string,
    id: number,
    name: string,
    categoryName: string,
    typeName: string,
    typeSysName: string,
    favorite: boolean,
    address: string,
    logo: TLogo,
    status: {
        code: number,
        description: string
    },
    timezone: string
}
export type TLogo = {
    id: number,
    fileName: string,
    contentType: string,
    size: number,
    dataLoad: string,
    hash: string,
    storageId: string
}
export type TOrganization = {
    geo_lat: string,
    geo_lon: string,
    id: number,
    shortName: string,
    fullName: string,
    nameWithLegal: string,
    legalId: number,
    legalName: string,
    fullAddress: string,
    settlementWithType: string,
    city: string,
    cityOnLogin: string,
    district: string,
    discriminator: string,
    favorite: boolean,
    isDuplicate: boolean,
    logo: TLogo,
    parent: TParent,
    status: string,
    statusName: string,
    timezone: string,
    type: string
}
export type TParent = {
    id: number,
    fullName: string
}
export type TRoles = {
    id: number,
    name: string,
    description: string,
    isBase: boolean,
    isClub: boolean,
    rights: string[]
}
export type TRights = {
    id: string,
    name: string,
    description: string,
    children: TRights[]
}
export type TCommissionType = {
    id: number,
    name: string,
    description: string
}
export type commissionDecision = {
    id: number,
    name: string,
    description: string
}
export type TCommissionTypeMember = {
    id: number,
    details: {
        id: number,
        rfsId: number,
        fio: string,
        firstName: string,
        middleName: string,
        lastName: string,
        birthDate: string,
        orgName: string,
        position: string,
        sportRole: string
    },
    roleId: number,
    active: boolean
}
export type TFiles = {
    name: string,
    storageId: string
}
export type TClubExperts = {
    experts: number[]
}