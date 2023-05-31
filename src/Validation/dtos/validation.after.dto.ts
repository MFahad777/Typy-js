import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationAfterDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> {
    params: {
        date : string | "tomorrow" | "today"
    }
}