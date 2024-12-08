import { pool } from '@config/databases';
import { Member, toMember } from '@/model/members.model';
import { injectable } from 'tsyringe';

@injectable()
export class MemberRepository {

    private readonly tableName = 'members';

    async findById(id: number): Promise<Member | null>{
        try {
            const [ rows ] = await pool.query(
                `SELECT * FROm ${this.tableName} WHERE id = ?`,
                [id]
            )
            const result = rows as any[];
            return result.length ? toMember(result[0]) : null;
        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    };

    async findByEmail(email: string): Promise<Member | null>{
        try {
            const [ rows ] = await pool.query(
                `select * from ${this.tableName} WHERE email = ?`,
                [ email ]
            )
            const result = rows as any[];
            return result.length ? toMember(result[0]) : null;
        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    };

    async findByNickname(nickname: string): Promise<Member | null>{
        try {
            const [ rows ] = await pool.query(
                `select * from ${this.tableName} WHERE nickname = ?`,
                [ nickname ]
            )
            const result = rows as any[];
            return result.length ? toMember(result[0]) : null;
        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    };

    async create(member: Partial<Member>): Promise<Member | null>{
        try {
            const [ rows ] = await pool.query(
                `insert into ${this.tableName}(email, nickname, password ) values(?, ?, ?)`,
                [ member.email, member.nickname, member.password]
            )
            const id = (rows as any).insertId;
            return this.findById(id);
        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    };

    async update(id: number, member: Partial<Member>): Promise<Member | null>{
        try {
            const fields = Object.keys(member)
                .map(key => `${key} = ?`)
                .join(', ');
            const values = [...Object.values(member), id];

            const [ rows ] = await pool.query(
                `update ${this.tableName} set ${fields} where id = ?`,
                values
            )
            return this.findById(id);

        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    };

    async delete(id: number): Promise<boolean>{
        try {
            const [ result ] = await pool.query(
                `delete from ${this.tableName} where id = ?`,
                [ id ]
            )
            return (result as any).affectedRows > 0;
        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }

        
    };

    async select(filters: Partial<Member>): Promise<Member[]>{
        try {

            const conditions: string[] = [];
            const values: any[] = [];

            Object.entries(filters).forEach(([key, value]) => {
                switch(key) {
                    case 'email':
                    case 'nickname':
                        conditions.push(`${key} LIKE ?`);
                        values.push(`%${value}%`);
                        break;
                    
                    case 'id':
                        conditions.push(`${key} = ?`);
                        values.push(value);
                        break;
                }
            });

            const whereClause = conditions.length 
            ? ` WHERE ${conditions.join(' AND ')}` 
            : '';

            const [ rows ] = await pool.query(
                `SELECt * FROM ${this.tableName} ${whereClause} `
            );
            return (rows as any[]).map(toMember)
        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    };
    
}

// 유저 id를 통한 검색도 필요로 생각됨

// 추후 계획
// commnet 답변 테이블 dao 추가하기