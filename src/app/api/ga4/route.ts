import { fetchGA4Analytics } from "@/lib/ga4-api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const days = Number(searchParams.get("days") || "30");
    const site = searchParams.get("site") || "all";

    const data = await fetchGA4Analytics(days, site);

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch GA4 data";

    // GA4 권한/설정 문제인지 확인
    const isAuthError =
      message.includes("PERMISSION_DENIED") ||
      message.includes("not set") ||
      message.includes("access_denied");

    return NextResponse.json(
      {
        error: message,
        setupRequired: isAuthError,
        setupGuide: isAuthError
          ? [
              "1. Google Analytics 관리 > 속성 > 속성 액세스 관리에서 서비스 계정 이메일 추가 (뷰어 권한)",
              "2. GA4_PROPERTY_IDS 환경변수 설정: ai-architect:123456,koreaai-hub:789012,...",
              "3. Google Cloud Console > Analytics Data API v1 활성화",
            ]
          : undefined,
      },
      { status: isAuthError ? 503 : 500 }
    );
  }
}
