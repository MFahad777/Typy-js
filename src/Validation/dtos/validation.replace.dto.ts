import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationReplaceDto extends Omit<ValidationGeneralDto, 'message' | 'params' | 'customFunction'> {
    params:{
        value_to_replace: string | RegExp,
        new_value: string
    }
}