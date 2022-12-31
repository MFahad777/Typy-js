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
          min?:number,
          max?:number,
          values?:string[]
        },
        customFunction?: Function,
        checkIn?:"params" | "body" | "query" | "any"
    }[]
}