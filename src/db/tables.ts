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
        stateId : "state_id"
    }
}
export const userNotifications = {
    tableName : "rfsntf.user_notifications",
    columns : {
        userId : "user_id",
        isReceived : "is_received"
    }
}