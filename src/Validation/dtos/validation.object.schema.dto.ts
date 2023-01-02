export interface IRuleObjectSchemaDto {
    [field : string] : {
        type: string,
        message?:string,
        params?:{
          min?:number,
          max?:number,
          values?:string[],
          type?:string,
          strict?:boolean,
          secondField?:string,
          secondFieldValue?:string,
          appliedOnFieldValue?:string,
          fieldToCheckWith?:string,
          uniqueCheckType?:"unique_in" | "unique_out" | "unique_in_out"
        },
        customFunction?: Function,
        checkIn?:"params" | "body" | "query" | "any"
    }[]
}