import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationDistinctDto extends Omit<ValidationGeneralDto, 'params'> {
    params: {
        fieldToCheckWith?:string,
        uniqueCheckType?:"unique_in" | "unique_out" | "unique_in_out"
    }
}