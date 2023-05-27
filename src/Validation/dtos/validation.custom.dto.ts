import { ValidationGeneralDto } from "./validation.general.dto";

export interface ICustomValidationDto extends Omit<ValidationGeneralDto, 'message'> {
    customFunction: Function
}