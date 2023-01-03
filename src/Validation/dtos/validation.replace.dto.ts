import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationReplaceDto extends Omit<ValidationGeneralDto, 'type' | 'customFunction' | 'params'> {
    params:{
        values_to_replace: string | RegExp,
        new_value: string
    }
}