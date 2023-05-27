import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationInDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params: {
        values: any[]
    }
}