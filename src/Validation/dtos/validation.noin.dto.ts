import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationNoinDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params: {
        values: any[]
    }
}