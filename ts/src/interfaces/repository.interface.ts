import { Pool } from 'mysql';

interface UserRecord {
    id: number;
    otp: string;
    [key: string]: any; // for other potential user fields
}

interface ServiceRecord {
    service_model_name: string;
}

interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export interface Repository {
    pool: Pool;
}
