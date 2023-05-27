import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationRequiredIfNotDto extends Omit<ValidationGeneralDto, 'params'> {
    params: {
        secondField:string,
        secondFieldValue: string
    }
}