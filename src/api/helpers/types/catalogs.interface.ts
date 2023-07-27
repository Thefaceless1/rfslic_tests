export interface SeasonsInterface {
    id: number,
    current: boolean,
    dateStart: string,
    dateEnd: string,
    name: string
}

export interface CriteriaGroupInterface {
    id: number,
    name: string
}

export interface LicTypesInterface {
    id: number,
    name: string,
    sysName: string,
    description: string
}

export interface DocTypesInterface {
    id: number,
    name: string,
    description: string
}

export interface RankCriteriaInterface {
    id: number,
    code: string,
    description: string
}

export interface CriteriaTypesInterface {
    id: number,
    name: string,
    description: string
}

export interface LicDocStatusInterface {
    id: number,
    name: string,
    description: string
}

export interface ClubWorkersInterface {
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

export interface OfiInterface {
    geo_lat: string,
    geo_lon: string,
    id: number,
    name: string,
    categoryName: string,
    typeName: string,
    typeSysName: string,
    favorite: boolean,
    address: string,
    logo: LogoInterface,
    status: {
        code: number,
        description: string
    },
    timezone: string
}

export interface LogoInterface {
    id: number,
    fileName: string,
    contentType: string,
    size: number,
    dataLoad: string,
    hash: string,
    storageId: string
}

export interface OrganizationInterface {
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
    logo: LogoInterface,
    parent: ParentInterface,
    status: string,
    statusName: string,
    timezone: string,
    type: string
}

export interface ParentInterface {
    id: number,
    fullName: string
}

export interface RolesInterface {
    id: number,
    name: string,
    description: string,
    isBase: boolean,
    isClub: boolean,
    rights: string[]
}

export interface RightsInterface {
    id: string,
    name: string,
    description: string,
    children: RightsInterface[]
}

export interface CommissionTypeInterface {
    id: number,
    name: string,
    description: string
}

export interface ComDecisionInterface {
    id: number,
    name: string,
    description: string
}

export interface ComTypeMemberInterface {
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

export interface FilesInterface {
    name: string,
    storageId: string
}

export interface ClubExpertInterface {
    experts: number[]
}