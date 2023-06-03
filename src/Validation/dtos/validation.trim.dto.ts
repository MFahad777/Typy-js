import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationTrimDto extends Omit<ValidationGeneralDto, 'type' | 'customFunction' | 'params' | 'message' | 'bail'> {
    params:{
        chars:string
    }
}