import { Board, 
    BoardCategory, 
    BoardLike,
    toBoard, 
    toBoardCategoryes,
    toBoardLike
} from '@/model/boards.model';
import { pool } from '@config/databases';

export class board {
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
    
    async findAll(filters: Partial<Board>): Promise<Board[]>{
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
    async create(board: Partial<Board>): Promise<Board | null>{
        try {

            const [ rows ] = await pool.query(
                `insert into ${this.tableName}(member_id, title, content) values(?, ?, ?)`,
                [ board.member_id, board.title, board?.content ?? " "]
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

export class board_category{
    private readonly tableName = 'board_categoryes';

    // 단일 조회
    async findByBoardId(board_id : number) : Promise<BoardCategory | null>{
        try{
            const [ rows ] = await pool.query(
                `select * from ${this.tableName} where board_id = ?`,
                [ board_id ]
            )
            const result = rows as any
            return result.length ? toBoardCategoryes(result[0]) : null;
        } catch(error : any){
            throw new Error(`Failed to fetch users: ${error.message}`);
        }
    }

    // 카테고리 모두 조회
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