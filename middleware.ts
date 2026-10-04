import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_STOREFORGE_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_STOREFORGE_SUPABASE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response = NextResponse.next({ request });
          response.cookies.set(name, value, options);
        });
      },
    },
  });
  const { data } = await supabase.auth.getUser();
  if (
    !data.user &&
    (request.nextUrl.pathname === "/stores" ||
      request.nextUrl.pathname.startsWith("/stores/"))
  ) {
    const signIn = request.nextUrl.clone();
    signIn.pathname = "/auth/sign-in";
    signIn.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(signIn);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
