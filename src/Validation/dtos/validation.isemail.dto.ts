import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationIsEmailDto extends Omit<ValidationGeneralDto, 'customFunction' | 'params'> {
    params?: {
        pattern?: RegExp
    }
}