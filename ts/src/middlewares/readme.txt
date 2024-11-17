Express.js에서 미들웨어는 요청(request)과 응답(response) 사이에서 동작하는 함수들을 의미합니다. 
각각의 미들웨어는 요청을 처리하는 과정에서 특정 기능을 수행하고, 다음 미들웨어로 제어를 넘길 수 있습니다.

## 기본 구조

import { Request, Response, NextFunction } from 'express';

const middleware = (req: Request, res: Response, next: NextFunction) => {
    // 미들웨어 로직 실행
    next(); // 다음 미들웨어로 제어 전달
};

## 적용 예시

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ message: '인증 토큰이 없습니다.' });
    }

    try {
        // 토큰 검증 로직
        // jwt.verify(token, 'secret_key');
        next();
    } catch (error) {
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
};

// 특정 라우트에 미들웨어 적용
app.get('/protected', authMiddleware, (req, res) => {
    res.send('보호된 리소스에 접근했습니다.');
});

## 주요 사례
미들웨어의 주요 사용 사례:

로깅 (요청/응답 기록)
인증/인가
요청 본문 파싱
에러 처리
보안 설정 (CORS, helmet 등)
요청/응답 데이터 변환
캐싱
압축

## 구현할 미들웨어 
인증, 로깅, 에러처리 

## 사용 목적
미들웨어의 장점:

코드 재사용성
관심사의 분리
모듈화된 코드 구조
유지보수 용이성
확장성