import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/auth/callback", "/auth/confirm", "/api"]
const authPaths = ["/login", "/signup", "/forgot-password"]

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const { pathname } = new URL(request.url)

  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
  const isAuthPage = authPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/projects", request.url))
  }

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
