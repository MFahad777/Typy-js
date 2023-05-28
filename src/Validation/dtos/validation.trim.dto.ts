import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationTrimDto extends Omit<ValidationGeneralDto, 'type' | 'customFunction' | 'params' | 'message'> {
    params:{
        chars:string
    }
}