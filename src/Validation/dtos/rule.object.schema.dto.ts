export interface IRuleObjectSchemaDto {
    [field : string] : {
        type:string | "required" | "integer" | "isArray" | "array" | "custom",
        message?:string,
        params?:{
          [key : string] : string | number | null | undefined
        },
        customFunction?: Function,
        checkIn?:"params" | "body" | "query" | "any"
    }[]
}