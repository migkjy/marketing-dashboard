# 통합 마케팅 대시보드 — MVP 기획 보고

> 작성일: 2026-02-21
> 작성자: marketing-plan2 PL (marketing-plan PL 초안 기반 보완)
> 관련 태스크: c258b644 (통합 마케팅 대시보드)
> 서브태스크: cd1354d8

---

## 1. Executive Summary

CEO의 전 사업(apppro.kr, 프롬프트샵 등)에 흩어진 마케팅 지표를 하나의 대시보드로 통합한다.

**핵심 판단**: 2주 내 MVP 기준으로 **기존 칸반 대시보드를 확장**하는 방식이 가장 빠르다. 별도 프로젝트 신설은 불필요한 인프라 비용과 시간을 낭비한다.

**Phase 1 MVP 목표**: getlate.dev SNS 성과 + Stibee 뉴스레터 통계 + 블로그(blog_posts 테이블) 통계 + CRM 리드 수를 하나의 `/marketing` 페이지에서 확인. GA4/Meta/Google Ads는 API 설정이 CEO lane 대기 중이므로 Phase 2 이후 연동.

**추가 비용**: $0 (기존 인프라 완전 활용)

---

## 2. MVP 범위 (Scope)

### 포함 (Phase 1 — 즉시 구현 가능)

| 데이터 소스 | 표시할 지표 | 가능 이유 |
|---|---|---|
| **getlate.dev** | 플랫폼별 발행 수, 최근 발행 목록, 인게이지먼트(API 스펙 확인 필요) | API Key 발급 완료 |
| **Stibee** | 구독자 수, 발송 수, 오픈율, 클릭율 | REST API 제공, CEO API Key 확인 필요 |
| **블로그 (blog_posts 테이블)** | 포스트 수, 최근 발행 목록, 카테고리별 분포, 월별 발행 추이 | 직접 NeonDB 조회 가능 |
| **CRM (db_crm)** | 이메일 리드 총 수, 최근 7일 신규 가입, 월별 추이 | 직접 db_crm 조회 가능 |

### 제외 (Phase 1에서 제외)

- GA4 트래픽 분석 (API 설정 CEO lane 대기)
- Meta Pixel / Facebook Ads (설정 예정, 인증 2~4주 소요)
- Google Ads ROI (개발자 토큰 승인 수주 소요)
- 광고비 자동 집계
- AI 기반 콘텐츠 추천
- 자동 리포팅 이메일 발송

### 핵심 유저 시나리오 3가지

1. **주간 현황 체크**: CEO가 매주 대시보드 접속 → 이번 주 블로그/SNS/뉴스레터 실적을 한눈에 확인, 어느 채널이 성과가 좋은지 파악
2. **채널별 성과 비교**: 특정 블로그 포스트가 SNS의 어느 플랫폼(X/LinkedIn/Threads)에서 반응이 좋은지 비교, 리드 유입 채널 순위 확인
3. **콘텐츠 발행 현황 파악**: 최근 30일 콘텐츠 발행 빈도 + 누락 채널 확인, 뉴스레터 구독자 성장 추이 파악

---

## 3. 한계 (Limitations)

### 기술적 한계

- **GA4 API**: Google Analytics Data API v1 무료 제공이나, Google Cloud Console 서비스 계정 생성 + 권한 부여 필요 (CEO 액션)
- **Google Ads API**: 개발자 토큰 승인 절차 수주~수개월 소요 → MVP 완전 제외
- **Meta Marketing API**: Facebook Business Manager 인증 2~4주 소요 → MVP 제외
- **getlate.dev**: API Key 발급 완료, 단 인게이지먼트(좋아요/공유) 데이터 제공 여부 API 문서 확인 필요
- **Stibee**: REST API 제공, 단 CEO의 API Key 확인 후 연동 가능

### 비용 한계

- Vercel Hobby Plan 상업적 사용 금지 → **칸반 대시보드 플랜 확인 필수** (Phase 1 착수 전 CEO 확인 필요)
- NeonDB Free Plan: 0.5GB 스토리지 — 마케팅 메트릭 히스토리 캐싱 시 용량 주의 필요
- GA4 Data API: 무료 (일 200,000 요청 한도, 충분)

### 시간 한계 (2주 내 MVP)

- 1주차: 데이터 소스 연동 + 기본 UI 구성
- 2주차: 차트 추가 + 필터 + 모바일 반응형 + QA
- GA4/Meta 연동은 2주 내 불가 — CEO lane 대기 + 인증 소요

### 데이터 소스 한계

- **과거 SNS 데이터**: getlate.dev는 발행 이후 데이터만 수집 가능 (과거 소급 불가)
- **실시간성**: Stibee는 API 폴링 방식, Webhook 미제공 시 주기적 수집만 가능
- **블로그 조회수**: blog_posts 테이블의 view_count 컬럼 실제 수집 여부 확인 필요 (없으면 발행 통계만 가능)

---

## 4. 단계별 계획 (Phases)

### Phase 1 — MVP (1주차, 7일)

**목표**: 4개 데이터 소스 연동 + 단일 대시보드 페이지 배포

| 작업 | 예상 소요 | 비고 |
|---|---|---|
| getlate.dev API 연동 + SNS 성과 카드 | 2일 | API 스펙 확인 선행 |
| Stibee API 연동 + 뉴스레터 통계 카드 | 1.5일 | CEO API Key 제공 선행 |
| blog_posts DB 조회 + 블로그 통계 카드 | 0.5일 | 즉시 가능 |
| db_crm 리드 수 카드 + 추이 | 0.5일 | 즉시 가능 |
| UI 레이아웃 + 기본 차트 (Recharts) | 1.5일 | |
| QA 5개 항목 통과 | 1일 | 자비스 총괄이사 직접 수행 |

**산출물**: 칸반 대시보드 내 `/marketing` 페이지

### Phase 2 — 확장 (2주차, D8~14)

**목표**: GA4 연동 + 트렌드 분석 차트

- GA4 Data API 연동 (CEO 서비스 계정 설정 완료 후)
- 기간 필터 추가 (7일/30일/90일)
- 채널별 비교 차트 심화
- Stibee 오픈율/클릭율 트렌드 라인차트

### Phase 3 — 자동화 (3주차+)

**목표**: 수동 확인 없이 인사이트 자동 전달

- 주간 집계 → NeonDB 스냅샷 저장
- 매주 월요일 CEO 텔레그램 주간 마케팅 요약 자동 발송 (report.sh 활용)
- Meta Pixel + Google Ads 연동 (인증 완료 후)
- AI 기반 성과 요약 코멘트 자동 생성

---

## 5. 데이터 소스 & API 연동

### getlate.dev

- **API Key**: `.env`의 `GETLATE_API_KEY` (발급 완료)
- **계정**: migkjy@gmail.com
- **필요 작업**: API 문서에서 발행 이력 + 인게이지먼트 조회 엔드포인트 확인
- **비용**: 기존 요금제 내 포함 (추가 없음)
- **연동 방식**: Next.js API Route → getlate.dev API → 클라이언트 (서버사이드 요청으로 API Key 보호)

### Stibee

- **상태**: CEO API Key 확인 필요
- **가능 여부**: Stibee REST API 공개 제공. 뉴스레터 목록, 구독자 수, 발송 통계, 오픈율/클릭율 조회 가능
- **비용**: 기존 Stibee 요금제 내 포함
- **참고**: https://stibee.com/api/docs

### GA4

- **상태**: CEO lane 대기 (Google Analytics 계정 + GA4 Property ID + 서비스 계정 JSON Key 필요)
- **API**: Google Analytics Data API v1 — 무료, 일 200,000 요청
- **Phase**: 2 (CEO 설정 완료 후)

### Google Ads / Meta Marketing API

- **상태**: 설정 예정
- **Phase**: 3 (인증 절차 수주 소요)

### 블로그 (blog_posts 테이블, NeonDB)

- **가능 여부**: 즉시 가능 (직접 DB 조회)
- **현황**: 95건 기존 데이터
- **주요 조회**: 총 발행 수, 최근 발행 목록, 월별 발행 추이, 카테고리별 분포
- **view_count**: 컬럼 존재 여부 스키마 확인 필요 (없으면 발행 통계만)

### CRM (db_crm)

- **가능 여부**: 즉시 가능 (직접 DB 조회)
- **주요 조회**: 총 리드 수, 월별 신규 가입 추이, 최근 7일 신규 수

---

## 6. 기술 스택 추천

### 추천: 기존 칸반 대시보드 확장

**이유**:
- 칸반 대시보드(Next.js)가 이미 NeonDB + Vercel 연결 완료
- `/marketing` 라우트 추가만으로 MVP 구성 가능
- DB 연결, 인증, 레이아웃 재사용 → 개발 시간 절반 단축
- 별도 프로젝트 신설 시: Vercel 추가 배포 + DB 연결 재설정 + 도메인 추가 필요 → 불필요

**별도 프로젝트 신설은 Phase 3 완전 자동화 단계 이후 검토**

### 차트 라이브러리

- **Recharts** 추천: React 네이티브, 칸반 대시보드 기존 사용 가능성 높음, 경량, 커스터마이징 용이
- 대안: Chart.js + react-chartjs-2 (더 많은 차트 타입 필요 시)

### DB 스키마 초안 (마케팅 메트릭 캐싱용)

```sql
-- 마케팅 채널별 일별 스냅샷 (API Rate Limit 회피 + 로딩 속도 개선용 캐싱)
CREATE TABLE marketing_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL,
  channel VARCHAR(50) NOT NULL,  -- 'blog', 'sns_x', 'sns_linkedin', 'sns_threads', 'newsletter', 'crm'
  metric_key VARCHAR(100) NOT NULL,  -- 'post_count', 'subscriber_count', 'open_rate', 'lead_count'
  metric_value NUMERIC,
  raw_data JSONB,  -- 원본 API 응답 저장
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX ON marketing_snapshots(snapshot_date, channel, metric_key);
```

**CEO 결정 필요**: 이 테이블을 neondb(칸반 DB)에 둘지, db_crm에 둘지 (원칙: 프로젝트별 DB 분리)

---

## 7. 비용 예상

### API 비용

| API | 비용 | 비고 |
|---|---|---|
| getlate.dev | 무료 (기존 요금제) | API Key 발급 완료 |
| Stibee | 무료 (기존 요금제) | CEO API Key 확인 필요 |
| GA4 Data API | 무료 | 일 200,000 요청 한도, Phase 2 |
| Google Ads API | 무료 | 개발자 토큰 승인 필요, Phase 3 |
| Meta Marketing API | 무료 | Business 인증 필요, Phase 3 |

### 인프라 비용

| 항목 | 현황 | 추가 비용 |
|---|---|---|
| Vercel | 칸반 대시보드 기존 사용 | 없음 (확장이므로) |
| NeonDB | 기존 Free Plan | 없음 (용량 모니터링 필요) |
| 도메인 | apppro.kr 기존 사용 | 없음 |

**Phase 1 추가 비용: $0**

### ROI 추정

- 마케팅 분석 도구 외부 SaaS 대체 효과: Databox($47/월), HubSpot($45/월) 대비 절감
- CEO 주간 분석 시간: 2~3시간 → 15분으로 단축
- 채널별 성과 데이터 기반 콘텐츠 전략 의사결정 속도 향상

---

## 8. CEO 결정 필요 사항

| # | 결정 사항 | 옵션 | 추천 | 우선순위 |
|---|---|---|---|---|
| 1 | **마케팅 메트릭 DB 위치** | (a) neondb, (b) db_crm | db_crm 추천 (DB 분리 원칙) | Phase 1 착수 전 필수 |
| 2 | **Stibee API Key 제공** | Stibee 관리자 → API Key 발급 | 제공 | Phase 1 |
| 3 | **getlate.dev API 범위 확인** | CEO 계정에서 API 문서 URL 확인 | PL이 직접 탐색 시도 | Phase 1 |
| 4 | **칸반 대시보드 Vercel 플랜** | Hobby(상업 불가) vs Pro | Pro 업그레이드 or Cloudflare Pages 이전 검토 | 착수 전 확인 |
| 5 | **GA4 서비스 계정 설정** | Google Cloud Console에서 서비스 계정 + JSON Key | Phase 2에서 처리 | Phase 2 |

---

## 9. Build vs Buy 분석

### 자체 구축 (추천)

**장점**:
- 추가 비용 $0 (무료 API + 기존 인프라)
- CEO 사업 특화 지표 완전 커스터마이징 (칸반 태스크와 마케팅 성과 연계 가능)
- AI 자동 분석/코멘트 기능 Phase 3에서 추가 가능
- Claude Code로 빠른 개발 가능

**단점**:
- 초기 개발 시간 필요 (5~7일)
- 외부 API 변경 시 유지보수 필요

### 기존 SaaS 도구 (비추천)

| 도구 | 비용 | 장점 | 단점 |
|---|---|---|---|
| Google Looker Studio | 무료 | GA4 네이티브 연동 | NeonDB/Stibee 연동 어려움, 커스터마이징 제한 |
| Databox | $47/월+ | 500+ 연동 지원 | 월 고정 비용, 오버스펙 |
| Metabase | 오픈소스 무료 | DB 직접 연결 가능 | 설치/운영 부담, SNS API 연동 없음 |
| HubSpot Marketing | $45/월+ | CRM 통합 | 비용 높음, getlate.dev 미지원 |

### 하이브리드 방안

1. **코어 대시보드**: 자체 구축 (Next.js, 칸반 확장)
2. **GA4 임시 뷰**: Phase 2 전까지 Google Looker Studio 무료 사용 (GA4만)
3. **광고 관리**: 각 플랫폼 네이티브 대시보드 활용 (API 승인 전까지)

**결론**: CEO 사업 특성상 getlate.dev + Stibee + NeonDB를 동시에 통합해야 하므로, SaaS 도구 커스터마이징 한계가 명확하다. **자체 구축이 최선.**

---

## 10. MVP 실행 체크리스트

### CEO 액션 (Before 개발 착수)

- [ ] 마케팅 메트릭 DB 위치 결정 (neondb vs db_crm)
- [ ] Stibee API Key 발급 + `.env`에 `STIBEE_API_KEY` 추가
- [ ] Vercel 플랜 확인 (상업적 사용 가능 여부)

### PL 액션 (CEO 결정 후)

- [ ] getlate.dev API 엔드포인트 문서 탐색
- [ ] blog_posts 테이블 view_count 컬럼 존재 여부 확인
- [ ] 칸반 대시보드에 `/marketing` 라우트 추가
- [ ] 4개 데이터 소스 카드 UI 구현
- [ ] Recharts 바차트/라인차트 추가
- [ ] 기간 필터 (7일/30일) 기본 구현
- [ ] QA 5개 항목 통과 (자비스 수행)

---

*이 기획서는 맥클로 VP 검수 후 개발 착수 가능*
*CEO 결정 필요 사항 5개 중 최소 1, 2, 4번 완료 후 Phase 1 착수*
