// 데이터 접근을 호출하고 가공하여 원하는 데이터만을 전달해주는 역할을 담당한다.



## 사용 예시
// repositories/user.repository.ts
import { pool } from '../config/database';
import { IUser, toUser } from '../models/user.model';

export class UserRepository {
    private readonly tableName = 'users';

    public async findAll(): Promise<IUser[]> {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM ${this.tableName}`
            );
            return (rows as any[]).map(toUser);
        } catch (error) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    public async findById(id: number): Promise<IUser | null> {
        try {
            const [rows] = await pool.query(
                `SELECT * FROM ${this.tableName} WHERE id = ?`,
                [id]
            );
            const result = rows as any[];
            return result.length ? toUser(result[0]) : null;
        } catch (error) {
            throw new Error(`Failed to fetch user by id: ${error.message}`);
        }
    }

    public async create(user: Omit<IUser, 'id'>): Promise<IUser> {
        try {
            const [result] = await pool.query(
                `INSERT INTO ${this.tableName} (email, username, password) VALUES (?, ?, ?)`,
                [user.email, user.username, user.password]
            );
            const id = (result as any).insertId;
            return this.findById(id);
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }

    public async update(id: number, user: Partial<IUser>): Promise<IUser | null> {
        try {
            const fields = Object.keys(user)
                .map(key => `${key} = ?`)
                .join(', ');
            const values = [...Object.values(user), id];

            await pool.query(
                `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`,
                values
            );
            return this.findById(id);
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }

    public async delete(id: number): Promise<boolean> {
        try {
            const [result] = await pool.query(
                `DELETE FROM ${this.tableName} WHERE id = ?`,
                [id]
            );
            return (result as any).affectedRows > 0;
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }

    // 복잡한 쿼리 예시
    public async findUserWithPosts(userId: number): Promise<any> {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    u.*,
                    p.id as post_id,
                    p.title as post_title,
                    p.content as post_content
                FROM ${this.tableName} u
                LEFT JOIN posts p ON u.id = p.user_id
                WHERE u.id = ?
            `, [userId]);
            
            return this.transformUserWithPosts(rows as any[]);
        } catch (error) {
            throw new Error(`Failed to fetch user with posts: ${error.message}`);
        }
    }

    private transformUserWithPosts(rows: any[]): any {
        if (!rows.length) return null;
        
        const user = toUser(rows[0]);
        const posts = rows
            .filter(row => row.post_id)
            .map(row => ({
                id: row.post_id,
                title: row.post_title,
                content: row.post_content
            }));
        
        return { ...user, posts };
    }
}