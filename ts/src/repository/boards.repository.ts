import { SearchBoardDto } from '@/dtos/borads.dto';
import { Board, 
    BoardCategory, 
    BoardLike,
    toBoard, 
    toBoardCategoryes,
    toBoardLike
} from '@/model/boards.model';
import { pool } from '@config/databases';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class BoardRepository {
    private readonly tableName = 'board';

    async findById(id: number): Promise<Board | null>{
        try {
            const [ rows ] = await pool.query(
                `SELECt * FROm ${this.tableName} where id = ?`,
                [ id ]
            )
            const result = rows as any
            return result.length ? toBoard(result[0]) : null;
        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    };
    
    async findAll(filters: Partial<SearchBoardDto>): Promise<Board[]>{
        try {
            const [ rows ] = await pool.query(
                `SELECt * FROm ${this.tableName} where id = ?`
            )
            return (rows as any[]).map(toBoard)
        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    };

    // 구상 추가 필요
    // 카테고리 추가하기 
    async create(board: Partial<Board>): Promise<Board | null>{
        try {

            const [ rows ] = await pool.query(
                `insert into ${this.tableName}(member_id, title, content) values(?, ?, ?)`,
                [ board.member_id, board.title, board?.description ?? " "]
            )
            const id = (rows as any).insertId
            return this.findById(id)
        } catch ( error: any ) {
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    };

    async update(id: number, board: Partial<Board>): Promise<Board | null>{
        try {
            const fields = Object.keys(board)
            .map(key => `${key} = ?`)
            .join(', ');
            const values = [...Object.values(board), id];

            const [ rows ] = await pool.query(
                `update ${this.tableName} set ${fields} where id = ?`,
                values
            )
            return this.findById(id)
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
    
}

export class BoardCategoryRepository{
    private readonly tableName = 'board_categoryes';

    async findByBoardId(board_id : number) : Promise<BoardCategory[] | null>{
        try{
            const [ rows ] = await pool.query(
                `select * from ${this.tableName} where board_id = ?`,
                [ board_id ]
            )
            return (rows as any[]).map(toBoardCategoryes)
        } catch(error : any){
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    async findByCategoryId(category_id: number) : Promise<BoardCategory[]>{
        try{
            const [ rows ] = await pool.query(
                `select * from ${this.tableName} where category_id = ?`,
                [ category_id ]
            )
            return (rows as any[]).map(toBoardCategoryes)
        } catch(error : any){
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    // 개선 코드
    async validateCategoryIds(categoryIds: number[]): Promise<boolean[]> {
        try {
            // Promise.all을 사용하여 모든 비동기 작업을 병렬로 처리
            const results = await Promise.all(
                categoryIds.map(async (categoryId) => {
                    try {
                        const [rows] = await pool.query<RowDataPacket[]>(
                            'SELECT COUNT(*) as count FROM category WHERE id = ?',
                            [categoryId]
                        );
                        // rows가 배열이고 첫 번째 요소가 존재하는지 확인
                        return Array.isArray(rows) && rows[0]?.count > 0;
                    } catch (err) {
                        console.error(`Error checking category ${categoryId}:`, err);
                        return false;
                    }
                })
            );
     
            return results;
        } catch (error: unknown) {
            // 에러 타입을 구체적으로 처리
            if (error instanceof Error) {
                throw new Error(`카테고리 검증 실패: ${error.message}`);
            }
            throw new Error('카테고리 검증 중 알 수 없는 오류 발생');
        }
    }

    // 반환 타입 수정 필요
    async create(boardId: number, categoryIds: number[]){
        const connetion = await pool.getConnection();

        try {
            await connetion.beginTransaction();

            const result = await Promise.all(
                categoryIds.map(async (categoryId) => {
                    try {
                        const [rows] = await connetion.query<ResultSetHeader>(
                            `insert into ${this.tableName} values(?, ?)`,
                            [boardId, categoryId]
                        );
                        return {
                            categoryId,
                            success : rows.affectedRows > 0,
                            error : rows.affectedRows > 0 ? "등록 실패" : undefined
                        };
                    } catch (err : any) {
                        console.error(`Error checking category ${categoryId}:`, err);
                        return {
                            categoryId,
                            success : false,
                            error : err.message ?? "알수없는 에러"
                        };
                    }
                })
            )

            const isSuccess = result.every(current => current.success)
            
            if(isSuccess){
                await connetion.commit();
            } else {
                await connetion.rollback();
            }

            return result;
        } catch(error){
            await connetion.rollback();
            throw error;
        } finally {
            connetion.release();
        }
    }

}


export class board_likes {
    private readonly tableName = 'board_likes';

    async findByBoardId(board_id : number) : Promise<BoardLike[]>{
        try {
            const [ rows ] = await pool.query(
                `select * from ${this.tableName} where board_id = ?`,
                [ board_id ]
            )
            return (rows as any[]).map(toBoardLike)
        } catch (error : any){
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    async findByUserId(user_id : number) : Promise<BoardLike[]>{
        try {
            const [ rows ] = await pool.query(
                `select * from ${this.tableName} where user_id = ?`,
                [ user_id ]
            )
            return (rows as any[]).map(toBoardLike)
        } catch (error : any){
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }
}