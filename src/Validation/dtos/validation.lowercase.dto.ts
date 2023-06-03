import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationLowercaseDto extends Omit<ValidationGeneralDto, 'params' | 'type' | 'message' | 'customFunction' | 'bail'> {}