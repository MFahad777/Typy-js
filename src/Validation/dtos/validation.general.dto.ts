export interface ValidationGeneralDto {
    message? :string,
    params?: {
        [key : string] : any
    },
    bail?: boolean,
    customFunction? : Function | null | undefined,
    checkIn?: 'params' | 'body' | 'query' | 'header' | 'any'
}