import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationRequiredWithDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params: {
        fields: string[]
    }
}