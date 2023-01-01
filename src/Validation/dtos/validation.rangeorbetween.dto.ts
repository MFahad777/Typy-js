import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationRangeorbetweenDto extends Omit<ValidationGeneralDto, 'params'> {
    params: {
        min: number | Date | string,
        max: number | Date | string
        type: "number" | "date" | "field"
    }
}