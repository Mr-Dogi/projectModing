import { Transform, Type, Expose } from 'class-transformer';

export class BaseErrorResponse{
    @Expose()
    success!: boolean

    @Expose()
    @Type(() => Object)
    error!: ErrorPacket
}

export class ErrorPacket{
    @Expose()
    message?: string

    @Expose()
    details?: object
}