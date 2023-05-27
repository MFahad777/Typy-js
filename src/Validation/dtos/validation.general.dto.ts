export interface ValidationGeneralDto {
    message? :string,
    params?: {
        [key : string] : any
    },
    customFunction? : Function | null | undefined,
    checkIn?: 'params' | 'body' | 'query' | 'any'
}