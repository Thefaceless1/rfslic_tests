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