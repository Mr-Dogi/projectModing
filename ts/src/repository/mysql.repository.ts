import mysql, { Pool, Connection, PoolConnection, MysqlError } from 'mysql';
import { Repository } from '@interfaces/repository.interface'

interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

interface UserRecord {
    id: number;
    otp: string;
    [key: string]: any; // for other potential user fields
}

interface ServiceRecord {
    service_model_name: string;
}

const config: DatabaseConfig = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "bnctech29@",
    database: "OTA"
};


class Mysql implements Repository {
    pool: Pool;

    constructor(config: DatabaseConfig) {
        this.pool = mysql.createPool(config);
    }

    __findByid(id: number): Promise<UserRecord[]> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: MysqlError | null, connection: PoolConnection) => {
                if (err) reject(err);
                else {
                    const sql = `SELECT * FROM user WHERE id = ?`;
                    connection.query(sql, [id], (err: MysqlError | null, rows: UserRecord[]) => {
                        if (err) reject(err);
                        else resolve(rows);
                        connection.release();
                    });
                }
            });
        });
    }

    __updateByid(id: number, otp: string): Promise<{ affectedRows: number }> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: MysqlError | null, connection: PoolConnection) => {
                if (err) reject(err);
                else {
                    const sql = `UPDATE user SET otp = ? WHERE id = ?`;
                    connection.query(sql, [otp, id], (err: MysqlError | null, rows: { affectedRows: number }) => {
                        if (err) reject(err);
                        else resolve(rows);
                        connection.release();
                    });
                }
            });
        });
    }

    __findService(): Promise<ServiceRecord[]> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: MysqlError | null, connection: PoolConnection) => {
                if (err) reject(err);
                else {
                    const sql = `SELECT DISTINCT service_model_name FROM service ORDER BY service_model_name`;
                    connection.query(sql, (err: MysqlError | null, rows: ServiceRecord[]) => {
                        if (err) reject(err);
                        else resolve(rows);
                        connection.release();
                    });
                }
            });
        });
    }
}

export default mysql;