export interface IRuleObjectSchemaDto {
    [field : string] : {
        type: "required" |
            "integer" |
            "isArray" |
            "array" |
            "custom" |
            "mongoid" |
            "in",
        message?:string,
        params?:{
          [key : string] : any
        },
        customFunction?: Function,
        checkIn?:"params" | "body" | "query" | "any"
    }[]
}