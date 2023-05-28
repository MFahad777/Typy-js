import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationIsjwtDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction'> { }