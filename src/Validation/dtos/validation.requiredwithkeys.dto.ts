import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationRequiredWithKeysDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params: {
        keys: string[]
    }
}
