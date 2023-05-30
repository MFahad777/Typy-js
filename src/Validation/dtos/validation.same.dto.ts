import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationSameDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params: {
        negate?: boolean,
        otherField: string
    }
}