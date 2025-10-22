# 🚀 밈 백과사전 설치 가이드

상세한 설치 및 설정 가이드입니다.

## 📋 목차

1. [시스템 요구사항](#시스템-요구사항)
2. [MongoDB 설정](#mongodb-설정)
3. [프로젝트 설정](#프로젝트-설정)
4. [개발 환경 실행](#개발-환경-실행)
5. [프로덕션 배포](#프로덕션-배포)
6. [문제 해결](#문제-해결)

## 시스템 요구사항

### 필수 소프트웨어

- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상 (또는 yarn, pnpm)
- **MongoDB**: 5.0 이상

### 권장 사양

- RAM: 4GB 이상
- 디스크 공간: 2GB 이상

## MongoDB 설정

### 옵션 1: 로컬 MongoDB 설치 (Windows)

#### 1단계: MongoDB 다운로드

1. https://www.mongodb.com/try/download/community 방문
2. 최신 버전의 Windows용 MSI 다운로드
3. 설치 프로그램 실행

#### 2단계: MongoDB 설치

1. "Complete" 설치 옵션 선택
2. "Install MongoDB as a Service" 체크
3. "Install MongoDB Compass" 체크 (GUI 도구)
4. 설치 완료

#### 3단계: MongoDB 서비스 시작

PowerShell 또는 CMD를 관리자 권한으로 실행:

```bash
net start MongoDB
```

#### 4단계: 연결 확인

```bash
mongosh
```

성공적으로 연결되면 MongoDB 셸이 열립니다.

### 옵션 2: MongoDB Atlas (클라우드, 무료)

#### 1단계: 계정 생성

1. https://www.mongodb.com/cloud/atlas 방문
2. "Try Free" 클릭하여 계정 생성
3. 이메일 인증

#### 2단계: 클러스터 생성

1. "Create a Cluster" 클릭
2. **FREE Shared Tier** 선택
3. 지역 선택 (가장 가까운 지역, 예: Seoul 또는 Tokyo)
4. Cluster Name 입력
5. "Create Cluster" 클릭

#### 3단계: 데이터베이스 사용자 생성

1. 왼쪽 메뉴에서 "Database Access" 클릭
2. "Add New Database User" 클릭
3. 사용자 이름과 비밀번호 입력 (기억해두세요!)
4. "Database User Privileges"를 "Read and write to any database"로 설정
5. "Add User" 클릭

#### 4단계: 네트워크 액세스 설정

1. 왼쪽 메뉴에서 "Network Access" 클릭
2. "Add IP Address" 클릭
3. 개발 환경에서는 "Allow Access from Anywhere" 선택 (0.0.0.0/0)
   - ⚠️ 프로덕션에서는 특정 IP만 허용하세요!
4. "Confirm" 클릭

#### 5단계: 연결 문자열 가져오기

1. "Database" 메뉴로 돌아가기
2. 클러스터의 "Connect" 버튼 클릭
3. "Connect your application" 선택
4. Driver를 "Node.js"로, Version을 최신으로 선택
5. 연결 문자열 복사 (예: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
6. `<password>`를 실제 비밀번호로 교체

## 프로젝트 설정

### 1단계: 프로젝트 폴더로 이동

```bash
cd 밈백과사전
```

### 2단계: 의존성 설치

```bash
npm install
```

설치 시간: 약 2-5분 (인터넷 속도에 따라 다름)

### 3단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력:

#### 로컬 MongoDB 사용 시:

```env
MONGODB_URI=mongodb://localhost:27017/meme-encyclopedia
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

#### MongoDB Atlas 사용 시:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meme-encyclopedia?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

**참고**: `NEXTAUTH_SECRET`은 무작위 문자열로 설정하세요. 예:
```bash
# PowerShell에서 랜덤 문자열 생성
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Minimum 0 -Maximum 256}))
```

### 4단계: 샘플 데이터 추가

```bash
npm run crawl
```

이 명령어는:
- MongoDB에 연결
- 기존 데이터 확인
- 2000년대부터 2025년까지의 대표적인 밈 약 20-30개 추가

**예상 출력**:
```
MongoDB에 연결 중...
✅ MongoDB 연결 성공
샘플 밈 데이터 추가 중...
✅ "Gangnam Style" (2012년 7월) 추가됨
✅ "Doge" (2013년 8월) 추가됨
...
✨ 총 25개의 밈이 추가되었습니다!
```

## 개발 환경 실행

### 개발 서버 시작

```bash
npm run dev
```

**출력**:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 웹사이트 열기

브라우저에서 http://localhost:3000 방문

### 개발 중 팁

- 파일을 저장하면 자동으로 새로고침됩니다 (Hot Reload)
- 터미널에서 `Ctrl + C`로 서버 중지
- 포트 변경: `PORT=3001 npm run dev`

## 프로덕션 배포

### Vercel에 배포 (추천)

#### 1단계: GitHub에 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/meme-encyclopedia.git
git push -u origin main
```

#### 2단계: Vercel 설정

1. https://vercel.com 방문 및 로그인 (GitHub 계정 연동)
2. "New Project" 클릭
3. GitHub 저장소 선택
4. "Import" 클릭

#### 3단계: 환경 변수 설정

1. "Environment Variables" 섹션에서:
   - Name: `MONGODB_URI`
   - Value: (MongoDB Atlas 연결 문자열)
   - 추가
2. `NEXTAUTH_SECRET`, `NEXTAUTH_URL`도 동일하게 추가
3. `NEXTAUTH_URL`은 배포 후 실제 도메인으로 변경

#### 4단계: 배포

1. "Deploy" 클릭
2. 배포 완료까지 약 2-3분 대기
3. 배포된 URL 확인 (예: `https://your-project.vercel.app`)

### 기타 배포 옵션

#### Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

#### Netlify

1. https://netlify.com 에서 저장소 연결
2. Build command: `npm run build`
3. Publish directory: `.next`
4. 환경 변수 설정

## 문제 해결

### MongoDB 연결 오류

#### 증상:
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

#### 해결 방법:

1. MongoDB 서비스 확인:
```bash
# Windows PowerShell (관리자)
Get-Service MongoDB
```

2. 서비스가 중지되어 있으면:
```bash
net start MongoDB
```

3. MongoDB가 설치되지 않았다면 위의 "MongoDB 설정" 섹션 참고

### 포트 이미 사용 중

#### 증상:
```
Error: listen EADDRINUSE: address already in use :::3000
```

#### 해결 방법:

옵션 1: 다른 포트 사용
```bash
PORT=3001 npm run dev
```

옵션 2: 3000 포트 사용 중인 프로세스 종료
```bash
# PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### 이미지 로드 실패

#### 증상:
이미지가 표시되지 않거나 깨짐

#### 해결 방법:

1. `next.config.js`에 이미지 도메인 추가:
```js
images: {
  domains: ['localhost', 'i.imgur.com', 'upload.wikimedia.org', 'your-image-domain.com'],
}
```

2. HTTPS URL 사용 권장
3. 이미지 URL이 유효한지 확인

### npm install 오류

#### 증상:
```
npm ERR! code ERESOLVE
```

#### 해결 방법:

```bash
# 캐시 정리
npm cache clean --force

# 레거시 peer dependencies 허용
npm install --legacy-peer-deps
```

### TypeScript 오류

#### 증상:
빌드 시 TypeScript 오류 발생

#### 해결 방법:

```bash
# TypeScript 재설치
npm install --save-dev typescript @types/react @types/node

# tsconfig.json 확인
```

## 추가 설정

### MongoDB Compass 사용

MongoDB Compass는 MongoDB의 공식 GUI 도구입니다.

1. MongoDB 설치 시 함께 설치됨
2. 실행 후 연결 문자열 입력
3. 데이터베이스 `meme-encyclopedia` 선택
4. 컬렉션 `memes` 확인

### VS Code 확장 프로그램 추천

- **ESLint**: 코드 품질
- **Prettier**: 코드 포맷팅
- **Tailwind CSS IntelliSense**: Tailwind 자동완성
- **MongoDB for VS Code**: MongoDB 연결

### 개발 도구

```bash
# 린터 실행
npm run lint

# 타입 체크
npx tsc --noEmit

# 빌드 테스트
npm run build
```

## 성능 최적화

### 이미지 최적화

- Next.js Image 컴포넌트 사용 (이미 적용됨)
- 이미지를 WebP 형식으로 변환
- CDN 사용 (Vercel은 자동 CDN 제공)

### 데이터베이스 인덱싱

MongoDB에서 인덱스 생성 (자동으로 적용되어 있음):

```js
// models/Meme.ts에 정의됨
MemeSchema.index({ year: 1, month: 1 });
MemeSchema.index({ title: 'text', description: 'text' });
```

## 백업

### 데이터베이스 백업

```bash
# 로컬 MongoDB
mongodump --db meme-encyclopedia --out ./backup

# MongoDB Atlas
# 웹 인터페이스에서 "Backup" 메뉴 사용
```

### 데이터베이스 복원

```bash
mongorestore --db meme-encyclopedia ./backup/meme-encyclopedia
```

## 지원

문제가 해결되지 않으면:
1. GitHub Issues에 문제 보고
2. MongoDB 공식 문서 참고: https://docs.mongodb.com/
3. Next.js 공식 문서 참고: https://nextjs.org/docs

---

**설정 완료! 즐거운 개발 되세요! 🎉**

