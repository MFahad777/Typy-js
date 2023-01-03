import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationExistsDto extends Omit<ValidationGeneralDto, 'type' | 'params'> {
    params : {
    database:"mongodb" | "mongoose",
    mongodbOptions : {
        databaseConnection: string,
        isFieldValueObjectId:boolean,
        databaseName:string,
        collection:string,
        query:object | string
    },
    mongoose:{
        model:any,
        query:object | string
    }
    }
}