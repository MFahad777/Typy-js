import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationIsUUIDDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params: {
        version: 1 | 2 | 3 | 4 | 5 | '1' | '2' | '3' | '4' | '5' | 'all'
    }
}