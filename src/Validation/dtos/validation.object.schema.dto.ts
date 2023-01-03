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
          database?:"mongodb" | "mongoose",
          mongodbOptions? : {
              databaseConnection: string,
              isFieldValueObjectId:boolean,
              databaseName:string,
              collection:string,
              query:object | string
          },
          mongoose? : {
              model:any,
              query:object | string
          }
          chars?:string,
          values_to_replace: string | RegExp,
          new_value: string
        },
        customFunction?: Function,
        checkIn?:"params" | "body" | "query" | "any"
    }[]
}