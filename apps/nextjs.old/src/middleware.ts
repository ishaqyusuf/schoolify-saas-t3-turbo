import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { env } from "./env";

// export { auth as middleware } from "@acme/auth";

// Or like this if you need to do something here.
// export default auth((req) => {
//   console.log(req.auth) //  { session: { user: { ... } } }
// })

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const __hostName = `.${env.APP_ROOT_DOMAIN}`;
  const hostname = req.headers.get("host"); //!.replace(__hostName, __hostName);
  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;
  const isProd = env.NODE_ENV == "production";
  const _url = `/${isProd ? "daarul-hadith" : hostname}${path}`;
  if (isProd) return NextResponse.rewrite(new URL(_url, req.url));
  if (
    hostname === env.APP_ROOT_DOMAIN
    // ||
    // hostname === env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    // console.log("..");
    return NextResponse.rewrite(
      new URL(`${path === "/" ? "" : path}`, req.url),
    );
  }
  // // console.log(">>>>>>>>>>>>>>>");
  // // rewrite everything else to `/[domain]/[slug] dynamic route
  // console.log(["+++TENANT+++", hostname, path]);
  // console.log({ hostname, path, _url });
  return NextResponse.rewrite(new URL(_url, req.url));
}
