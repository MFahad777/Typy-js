import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationUniqueDto extends Omit<ValidationGeneralDto,'params' | 'customFunction' > {}
