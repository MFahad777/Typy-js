import { ValidationGeneralDto } from "./validation.general.dto";

export interface IValidationIsValidMongoIdDto extends Omit<ValidationGeneralDto, 'params' | 'customFunction' > {}