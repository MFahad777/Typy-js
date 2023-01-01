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
          appliedOnFieldValue?:string
        },
        customFunction?: Function,
        checkIn?:"params" | "body" | "query" | "any"
    }[]
}