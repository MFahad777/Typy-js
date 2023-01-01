export interface IRuleObjectSchemaDto {
    [field : string] : {
        type: "required" |
            "integer" |
            "isArray" |
            "array" |
            "custom" |
            "mongoid" |
            "in" |
            "notin" |
            "range" |
            "between",
        message?:string,
        params?:{
          min?:number,
          max?:number,
          values?:string[],
          type?:string,
        },
        customFunction?: Function,
        checkIn?:"params" | "body" | "query" | "any"
    }[]
}