export const workUsers = {
    tableName : "rfslic.work_users",
    columns : {
        userId : "user_id",
        isActive : "is_active",
        roleId : "role_id"
    }
}
export const operationsLog = {
    tableName : "rfslic.work_operations_log",
    columns : {
        id : "id",
        userId : "user_id"
    }
}
export const issuedLicense = {
    tableName : "rfslic.issued_licences",
    columns : {
        licId : "lic_id",
        number : "number",
        storageId : "storage_id"
    }
}
export const userRights = {
    tableName : "rfslic.work_user_rights",
    columns : {
        userId : "user_id",
        rightId : "right_id"
    }
}
export const roles = {
    tableName : "rfslic.work_roles",
    columns : {
        name : "name",
        description : "description",
        isBase : "is_base",
        isClub : "is_club",
        id : "id"
    }
}
export const licenses = {
    tableName : "rfslic.licenses",
    columns : {
        id : "id",
        joinId: "rfslic.licenses.id",
        joinProlicId: "rfslic.licenses.prolic_id",
        stateId : "state_id",
        prolicId : "prolic_id"
    }
}
export const prolicenses = {
    tableName : "rfslic.nsi_prolicenses",
    columns : {
        id : "id",
        licName : "licname",
        joinId : "rfslic.nsi_prolicenses.id",
        joinLicName : "rfslic.nsi_prolicenses.licname"
    }
}
export const commissions = {
    tableName : "rfslic.commissions",
    columns : {
        id : "id",
        name : "name"
    }
}