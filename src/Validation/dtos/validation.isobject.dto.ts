import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationIsobjectDto extends Omit<ValidationGeneralDto, 'params'> {
    params?: {
        strict?:boolean,
    }
}