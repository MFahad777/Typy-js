import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationNoinDto extends Omit<ValidationGeneralDto, 'params'> {
    params: {
        values: any[]
    }
}