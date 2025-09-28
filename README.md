# ☕ MoCa - 커피 레시피 공유 플랫폼

> **"내 커피 연구소"** - 완벽한 한 잔을 위한 레시피 공유 커뮤니티

커피 애호가들을 위한 전문적인 레시피 공유 및 관리 플랫폼입니다. 에스프레소와 드립 커피의 정확한 추출법을 기록하고, 다른 사용자들과 공유하며, 나만의 커피 레시피 라이브러리를 구축할 수 있습니다.

## ✨ 주요 기능

### 🔸 **전문적인 레시피 작성**
- **에스프레소**: 물 온도, 원두량, 추출시간, 추출량 등 세밀한 파라미터 관리
- **드립 커피**: 단계별 추출 과정, 물의 양, 시간 기록
- 원두 정보, 도구, 개인 팁 등 상세 정보 포함

### 🔸 **스마트 검색 & 탐색**
- 실시간 검색 및 고급 필터링
- 인기순, 최신순, 일간/주간 인기 레시피
- 레시피 타입별 분류 (에스프레소/드립)

### 🔸 **커뮤니티 기능**
- ⭐ 5점 척도 평점 시스템
- 💬 상세 리뷰 작성
- ❤️ 좋아요로 레시피 북마크
- 👤 사용자 프로필 및 팔로우

### 🔸 **개인 레시피 관리**
- "My Coffee Lab" - 개인 레시피 대시보드
- 작성한 레시피와 좋아요한 레시피 분리 관리
- 레시피 수정 및 삭제

### 🔸 **사용자 인증**
- 📧 이메일 회원가입/로그인
- 🌐 소셜 로그인 (Google, Kakao)
- 🖼️ 프로필 이미지 업로드

## 🛠 기술 스택

### **Frontend**
- **React Router v7** - SSR 지원 풀스택 프레임워크
- **TypeScript** - 타입 안전성
- **TailwindCSS v4** - 현대적인 스타일링
- **Shadcn/UI** - 일관된 디자인 시스템
- **Lucide React** - 아이콘 라이브러리

### **Backend & Database**
- **Supabase** - PostgreSQL 데이터베이스 + 인증 + 스토리지
- **Drizzle ORM** - 타입 안전 데이터베이스 조작
- **Row Level Security (RLS)** - 데이터 보안

### **Form & Validation**
- **Zod** - 런타임 스키마 검증
- **React Hook Form** 패턴

### **Deployment**
- **Vercel** - 프로덕션 배포
- **CI/CD** - GitHub Actions 통합

## 🚀 빠른 시작

### 사전 요구사항
- Node.js 18+
- npm 또는 pnpm
- Supabase 계정

### 설치 및 실행

1. **저장소 클론**
```bash
git clone [repository-url]
cd caffe-recipes-app
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.example .env
```

`.env` 파일에 Supabase 설정 추가:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
```

4. **데이터베이스 마이그레이션**
```bash
npm run db:migrate
```

5. **개발 서버 실행**
```bash
npm run dev
```

앱이 `http://localhost:5173`에서 실행됩니다.

## 📋 사용 가능한 스크립트

```bash
# 개발 서버 실행 (HMR 지원)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# TypeScript 타입 체크
npm run typecheck

# 데이터베이스 마이그레이션 생성
npm run db:generate

# 데이터베이스 마이그레이션 실행
npm run db:migrate

# 데이터베이스 관리 도구 실행
npm run db:studio

# Supabase 타입 생성
npm run db:typegen

# 코드 포맷팅
npm run format
```

## 🗃 프로젝트 구조

```
app/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── common/         # 공통 컴포넌트
│   ├── auth/           # 인증 관련 컴포넌트
│   └── recipes/        # 레시피 관련 컴포넌트
├── routes/             # 페이지 라우트
├── schemas/            # Zod 검증 스키마
├── lib/                # 유틸리티 및 설정
├── mutations/          # 데이터 변경 로직
├── queries/            # 데이터 조회 로직
├── db/                 # 데이터베이스 스키마
└── sql/                # SQL 마이그레이션
    ├── migrations/     # 스키마 변경
    ├── rls/           # 보안 정책
    └── triggers/      # 데이터베이스 트리거
```

## 🗄 데이터베이스 스키마

### 주요 테이블
- **profiles** - 사용자 프로필 정보
- **recipes** - 레시피 데이터 (JSONB로 타입별 파라미터 저장)
- **reviews** - 레시피 평점 및 리뷰
- **likes** - 좋아요 데이터
- **daily/weekly_popular_recipes** - 인기 레시피 캐시

### 데이터 타입
- **EspressoParams** - 에스프레소 추출 파라미터
- **DripParams** - 드립 커피 추출 파라미터 + 단계별 과정

## 🔒 보안

- **Row Level Security (RLS)** - 테이블별 접근 권한 제어
- **Supabase Auth** - JWT 기반 인증
- **환경 변수** - 민감한 정보 보호
- **API 키 관리** - 클라이언트/서버 키 분리

## 🚀 배포

### Vercel 배포
1. Vercel에 프로젝트 연결
2. 환경 변수 설정
3. 자동 배포 활성화

### 수동 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드된 파일들을 서버에 업로드
# build/ 폴더의 내용을 배포
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 🙏 감사의 말

- [React Router](https://reactrouter.com/) - 강력한 풀스택 프레임워크
- [Supabase](https://supabase.com/) - 완벽한 백엔드 솔루션
- [Shadcn/UI](https://ui.shadcn.com/) - 아름다운 컴포넌트 라이브러리
- [Vercel](https://vercel.com/) - 간편한 배포 플랫폼

---

**Made with ☕ & ❤️ for Coffee Lovers**