import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationInDto extends Omit<ValidationGeneralDto, 'params'> {
    params: {
        values: any[]
    }
}