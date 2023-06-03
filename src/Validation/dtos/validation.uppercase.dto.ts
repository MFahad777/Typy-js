import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationUppercaseDto extends Omit<ValidationGeneralDto, 'params' | 'type' | 'message' | 'customFunction' | 'bail'> {}