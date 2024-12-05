import { 
    Board,
    BoardStatus
 } from "@/model/boards.model";
import { 
    CreateBoardDto,
    SearchBoardDto,
    UpdateBoardDto,
    BoardDetailResponseDto,
    BaseBoardResponseDto,
    BoardListDataDto,
    BoardUpdateResponseDto,
    BoardStateUpdateResponseDto
 } from "@dtos/borads.dto"
 
import { BoardRepository, BoardCategoryRepository, Board_likes } from "@repository/boards.repository"
import { MemberRepository } from "@repository/members.repository"
import { HttpException } from "@exceptions/httpException"
import { Member } from "@/model/members.model";
import dayjs from "dayjs";

export class BoardSevice{
    boardRepository : BoardRepository;
    memberRepository : MemberRepository;
    boardCategoryRepository : BoardCategoryRepository;
    board_likes : Board_likes;

    constructor(){
        this.boardRepository = new BoardRepository();
        this.memberRepository = new MemberRepository();
        this.boardCategoryRepository = new BoardCategoryRepository();
        this.board_likes = new Board_likes();
    }

    public async createBoard(createBoardDto : CreateBoardDto):Promise<BaseBoardResponseDto | null>{
        try{
            
            let author  = await this.memberRepository.findByNickname(createBoardDto.author.nickname);
            if(!author) throw new HttpException(401, "유효하지 않은 사용자입니다");

            let memberId = author.id;

            if (createBoardDto.category) {
                const validCategories = await this.validateCategories(createBoardDto.category);
                if (!validCategories) {
                    throw new HttpException(404, "유효하지 않은 카테고리입니다.");
                }
            }

            let newBoard : Partial<Board> = {
                member_id : memberId,
                title : createBoardDto.title,
                cotent : createBoardDto.description,
                is_public: createBoardDto.isPublic ?? true,
                status: BoardStatus.ACTIVE
            };

            let createdBoard = await this.boardRepository.create(newBoard);
            if (!createdBoard) {
                throw new HttpException(500, "게시글 생성에 실패했습니다.");
            }
            
            if (createBoardDto.category) {
                await this.boardCategoryRepository.create(
                    createdBoard.id,
                    createBoardDto.category
                );
            }

            return this.mapToResponseCreateDto(createdBoard, author);
        }catch(error){
            throw error;
        }
    }

    public async searchBoards(searchBoardDto : SearchBoardDto):Promise<BoardListDataDto | null>{
        try{
            if(searchBoardDto.category){
                let existingCategori = await this.boardCategoryRepository.findByCategoryId(searchBoardDto.category)
                if (!existingCategori) throw new HttpException(404, "존재하지 않는 카테고리입니다.")
            }

            const board = await this.boardRepository.findAll(searchBoardDto);
            const countRow = await this.boardRepository.findAllBoardCount(searchBoardDto);
            if(!board) throw new HttpException(404, "조회 가능한 게시판이 없습니다.")

            const boardList: BoardListDataDto = {
                content : board,
                pageInfo : {
                    currentPage: searchBoardDto.page,
                    totalPages: (countRow % searchBoardDto.size),
                    totalElements: countRow,
                    size: searchBoardDto.size
                }
            }
    
            return boardList
        }catch(error){
            throw error;
        }
        
    }

    public async getBoardDetail(BoardId : number, userId: number): Promise<BoardDetailResponseDto | null>{
        try{
            const board = await this.boardRepository.findById(BoardId);
            if (!board) throw new HttpException(404, "존재하지 않는 게시글입니다");
            if (board.status === BoardStatus.DELETED) throw new HttpException(403, "삭제된 게시글입니다.");
            if (!board.is_public && !this.userAtivateChack(userId)) throw new HttpException(403, "접근 권한이 없습니다.");
    
            await this.incrementViewCount(BoardId, board.view_count);
    
            const [ author,  category] = await Promise.all([
                await this.memberRepository.findById(board.member_id),
                await this.boardCategoryInfos(BoardId)
            ])
    
            if(!author) throw new HttpException(404, "존재하지 않는 게시글입니다")
        
            return this.mapToResponseDetailDto(board, author, category || undefined);
        }catch(error){
            throw error
        }
        
    }

    public async updateBoard(boardId: number, userid : number, updateBoardDto : UpdateBoardDto): Promise<BoardUpdateResponseDto | null>{
        try{
            let findBoard = await this.boardRepository.findById(boardId);
            if (!findBoard) throw new HttpException(404, "존재하지 않는 게시글입니다");
    
            if (!this.canEdit(findBoard, userid)) {
                throw new HttpException(403, "수정 권한이 없습니다.");
            }
    
            if (updateBoardDto.category) {
                await this.updateBoardCategories(boardId, updateBoardDto.category);
            }
    
            const updatedBoard = await this.boardRepository.update(boardId, {
                title: updateBoardDto.title,
                cotent: updateBoardDto.description,
                is_public: updateBoardDto.isPublic,
                updated_at: dayjs().toDate()
            });
    
            if(!updatedBoard) throw new HttpException(409, "수정에 실패하였습니다");
    
            const updateResponse: BoardUpdateResponseDto = {
                id: updatedBoard.member_id.toString(),
                updatedAt: dayjs(updatedBoard?.updated_at).format('YYYY-MM-DD HH:mm:ss') ?? dayjs(updatedBoard.created_at).format('YYYY-MM-DD HH:mm:ss')
            };

            return updateResponse;
        }catch(error){
            throw error;
        }
    }

    public async boardDelete(boardId : number, userId: number): Promise<boolean>{
        try{
            let findBoard = await this.boardRepository.findById(boardId);
            if (!findBoard) throw new HttpException(404, "존재하지 않는 게시글입니다");
    
            if (!this.canEdit(findBoard, userId)) {
                throw new HttpException(403, "삭제 권한이 없습니다.");
            }
    
            let success = await this.boardRepository.update(boardId, {
                status : BoardStatus.DELETED,
                deleted_at : dayjs().toDate()
            });
    
            if (!success) throw new HttpException(409, "게시판 삭제에 실패하였습니다.");
            
            return true
        } catch {
            return false
        }
        
    }

    public async togglePublicState(boardId : number, userId: number): Promise<BoardStateUpdateResponseDto | null>{
        try {
            let oldBoard = await this.boardRepository.findById(boardId);
            if (!oldBoard) throw new HttpException(404, "존재하지 않는 게시글입니다");
    
            if (!this.canEdit(oldBoard, userId)) {
                throw new HttpException(403, "권한이 없습니다.");
            }
    
            let success  = await this.boardRepository.update(boardId, {
                is_public : !oldBoard.is_public,
                updated_at: dayjs().toDate()
            });
    
            if (!success) throw new HttpException(409, "공개 여부 변경에 실패하였습니다.");
    
            const newBoard = await this.boardRepository.findById(boardId);
            if (!newBoard) throw new HttpException(404, "존재하지 않는 게시글입니다");
            if (oldBoard.is_public != newBoard.is_public) throw new HttpException(409, "상태 업데이트에 실패하였습니다.");

            const BoardStateUpdateResponse:BoardStateUpdateResponseDto = {
                id : newBoard.id.toString(),
                isPublic : newBoard.is_public,
                updatedAt : dayjs(newBoard?.updated_at)?.format('YYYY-MM-DD HH:mm:ss') ?? dayjs(newBoard.created_at).format('YYYY-MM-DD HH:mm:ss')
            }
    
            return BoardStateUpdateResponse;
        }catch(error) {
            throw error
        }
        
    }

    public async likeIncrementBoard(boardId: number, memberId: number): Promise<boolean>{
        try {
            let Board = await this.boardRepository.findById(boardId);
            if (!Board) throw new HttpException(404, "존재하지 않는 게시글입니다");
            let member = await this.memberRepository.findById(memberId);
            if (!member) throw new HttpException(404, "사용자를 찾을 수 없습니다");
    
            await this.incrementLikeCount(boardId, Board.like_count)
            const result = this.board_likes.create(boardId, memberId);
            if(!result) throw new HttpException(409,"갱신에 실패하였습니다.")

            return true
        } catch(error){
            return false
        }
    }

    // 유틸리트 함수
    private async validateCategories(categoryIds: number[]): Promise<boolean> {
        const categories = await this.boardCategoryRepository.validateCategoryIds(categoryIds);
        return categories.filter(cureent => cureent === true).length === categoryIds.length;
    }

    private canEdit(board: Board, userId: number): boolean {
        return board.member_id === userId && board.status === BoardStatus.ACTIVE;
    }

    private mapToResponseCreateDto(board: Board, author: Member): BaseBoardResponseDto {
        return {
            id: board.id.toString(),
            title: board.title,
            description: board.cotent,
            author: {
                type: author.isAdmin() ? "ADMIN" : "USER",
                nickname: author.nickname
            },
            createdAt: dayjs(board.created_at).format('YYYY-MM-DD HH:mm:ss')
        };
    }

    private mapToResponseDetailDto(board: Board, author: Member, categoryInfo?: number[]): BoardDetailResponseDto {
        return {
            id: board.id.toString(),
            title: board.title,
            description: board.cotent,
            author: {
                type: author.isAdmin() ? "ADMIN" : "USER",
                nickname: author.nickname
            },
            createdAt: board.created_at.toISOString(),
            updatedAt: dayjs(board?.updated_at)?.format('YYYY-MM-DD HH:mm:ss') ?? dayjs(board.created_at).format('YYYY-MM-DD HH:mm:ss'), // 디폴트 값 필요
            viewCount: board.view_count,
            likeCount: board.like_count,
            commentCount: board.comment_count,
            isPublic : board.is_public,
            category: categoryInfo ? [...categoryInfo] : [],
            attachments : [],
        };
    }

    private async incrementLikeCount(boardId : number, currentLike : number){
        await this.boardRepository.update(boardId,{
            like_count : currentLike + 1
        })
    }

    private async incrementViewCount(boardId : number, currentView : number){
        await this.boardRepository.update(boardId,{
            view_count : currentView + 1
        })
    }

    private async boardCategoryInfos(boardId : number): Promise<number[] | null>{
        const res = await this.boardCategoryRepository.findByBoardId(boardId)
        if(res) return res.map(current => current.category_id)
        return null
        
    }

    private async updateBoardCategories(boardId: number, categoryInfo: number[]): Promise<boolean>{
        const res = await this.boardCategoryRepository.create(boardId, categoryInfo)
        return res.every(current => current.success === true)
    }

    private async userAtivateChack(userId: number){
        const res = await this.memberRepository.findById(userId);
        return res?.isActive ?? false
    }
    
}