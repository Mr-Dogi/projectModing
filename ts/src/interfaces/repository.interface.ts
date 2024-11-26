import { Pool } from 'mysql';

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
