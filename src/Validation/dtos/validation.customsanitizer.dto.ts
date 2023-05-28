import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationCustomSanitizerDto extends Omit<ValidationGeneralDto, 'type' | 'message' | 'params'> {
    customFunction:Function
}