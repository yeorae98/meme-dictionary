# 🎭 밈 백과사전

2000년부터 현재까지의 인터넷 밈을 연도별, 월별로 정리한 위키 스타일 백과사전입니다.

## ✨ 주요 기능

- 📅 **연도/월별 분류**: 밈을 연도와 월별로 체계적으로 정리
- 🔍 **강력한 검색**: 제목, 설명, 태그로 밈 검색
- 📖 **위키 스타일 편집**: 누구나 밈을 추가하고 편집 가능
- 📜 **편집 이력**: 모든 수정 내역을 투명하게 기록
- 🎨 **아름다운 UI**: 모던하고 반응형 디자인
- 🌙 **다크 모드**: 다크 모드 자동 지원
- 🤖 **자동 크롤링**: 샘플 데이터 자동 생성

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB + Mongoose
- **Markdown**: react-markdown
- **Deployment**: Vercel (추천)

## 📋 사전 요구사항

- Node.js 18 이상
- MongoDB (로컬 또는 MongoDB Atlas)
- npm 또는 yarn

## 🚀 설치 및 실행

### 1. 저장소 클론 및 의존성 설치

```bash
cd 밈백과사전
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# MongoDB 연결 문자열
MONGODB_URI=mongodb://localhost:27017/meme-encyclopedia
# 또는 MongoDB Atlas 사용 시:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/meme-encyclopedia

# NextAuth 설정 (향후 인증 기능 추가 시)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 3. MongoDB 설정

#### 로컬 MongoDB 사용 시:

```bash
# MongoDB 설치 (Windows)
# https://www.mongodb.com/try/download/community 에서 다운로드

# MongoDB 서비스 시작
net start MongoDB
```

#### MongoDB Atlas 사용 시:

1. https://www.mongodb.com/cloud/atlas 에서 무료 계정 생성
2. 클러스터 생성
3. 데이터베이스 사용자 추가
4. Network Access에서 IP 주소 허용
5. 연결 문자열을 `.env.local`에 추가

### 4. 샘플 데이터 추가 (선택사항)

```bash
npm run crawl
```

이 명령어는 2000년대부터 2025년까지의 대표적인 밈들을 자동으로 데이터베이스에 추가합니다.

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어보세요!

## 📖 사용 방법

### 밈 추가하기

1. 상단 메뉴에서 "밈 추가" 클릭
2. 필수 정보 입력:
   - 밈 제목
   - 연도 및 월
   - 대표 이미지 URL
   - 상세 설명 (마크다운 지원)
3. 선택 정보 입력:
   - 원본 영상 링크
   - 사용 예시
   - 태그
   - 출처 URL
   - 편집자 이름
4. "밈 추가하기" 버튼 클릭

### 밈 편집하기

1. 편집하려는 밈 페이지로 이동
2. "편집" 버튼 클릭
3. 내용 수정
4. "수정 사항" 필드에 변경 내용 설명 입력 (필수)
5. "수정 사항 저장" 버튼 클릭

### 밈 검색하기

홈페이지의 검색창에서 제목, 설명, 태그로 밈을 검색할 수 있습니다.

## 🤖 크롤링 스크립트

### 기본 크롤러 (샘플 데이터)

```bash
npm run crawl
```

2000년대부터 주요 밈들을 데이터베이스에 추가합니다.

### 고급 크롤러 (실제 웹 크롤링)

```bash
node scripts/advanced-crawler.js
```

⚠️ **주의**: 
- 웹사이트의 robots.txt를 준수합니다
- 과도한 크롤링은 IP 차단을 유발할 수 있습니다
- 요청 간 적절한 대기 시간이 설정되어 있습니다

## 📁 프로젝트 구조

```
밈백과사전/
├── app/                    # Next.js 앱 디렉토리
│   ├── api/               # API 라우트
│   │   └── memes/         # 밈 관련 API
│   ├── meme/              # 밈 상세 페이지
│   ├── add/               # 밈 추가 페이지
│   ├── edit/              # 밈 편집 페이지
│   ├── about/             # 소개 페이지
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈페이지
├── components/            # React 컴포넌트
│   ├── Header.tsx         # 헤더
│   ├── SearchBar.tsx      # 검색바
│   ├── YearMonthList.tsx  # 연도/월별 리스트
│   └── MemeCard.tsx       # 밈 카드
├── lib/                   # 유틸리티
│   └── mongodb.ts         # MongoDB 연결
├── models/                # Mongoose 모델
│   └── Meme.ts            # 밈 모델
├── scripts/               # 스크립트
│   ├── crawl-memes.js     # 기본 크롤러
│   └── advanced-crawler.js # 고급 크롤러
├── public/                # 정적 파일
├── .env.local             # 환경 변수 (생성 필요)
├── package.json           # 프로젝트 설정
├── tsconfig.json          # TypeScript 설정
├── tailwind.config.js     # Tailwind CSS 설정
└── README.md              # 이 파일
```

## 🔧 API 엔드포인트

### GET /api/memes
모든 밈 조회

### POST /api/memes
새로운 밈 추가

### GET /api/memes/[id]
특정 밈 조회

### PUT /api/memes/[id]
밈 수정

### DELETE /api/memes/[id]
밈 삭제

### GET /api/memes/search?q=[query]
밈 검색

## 🌐 배포

### Vercel에 배포

1. GitHub에 프로젝트 푸시
2. https://vercel.com 에서 import
3. 환경 변수 설정 (MONGODB_URI 등)
4. 배포

### 기타 플랫폼

- **Netlify**: Next.js 지원
- **Railway**: MongoDB 포함 배포 가능
- **Heroku**: 무료 플랜 있음

## 🎨 커스터마이징

### 색상 변경

`tailwind.config.js`에서 색상을 변경할 수 있습니다:

```js
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',    // 파란색
      secondary: '#8b5cf6',  // 보라색
    },
  },
}
```

### 스타일 수정

`app/globals.css`에서 글로벌 스타일을 수정할 수 있습니다.

## 🐛 문제 해결

### MongoDB 연결 오류

```
MongooseServerSelectionError: connect ECONNREFUSED
```

**해결 방법**:
- MongoDB 서비스가 실행 중인지 확인
- `.env.local`의 MONGODB_URI가 올바른지 확인

### 이미지 로드 실패

**해결 방법**:
- `next.config.js`의 `images.domains`에 이미지 도메인 추가
- HTTPS URL 사용 권장

### 포트 충돌

```
Port 3000 is already in use
```

**해결 방법**:
```bash
# 다른 포트 사용
PORT=3001 npm run dev
```

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포할 수 있습니다.

## 🤝 기여

이슈나 풀 리퀘스트를 자유롭게 제출해주세요!

## 📧 연락처

질문이나 제안이 있으시면 이슈를 열어주세요.

## 🙏 감사의 말

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Know Your Meme](https://knowyourmeme.com/)

---

**즐거운 밈 아카이빙 되세요! 🎉**

