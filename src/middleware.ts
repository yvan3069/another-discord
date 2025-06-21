import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

//https://github.com/apteryxxyz/next-ws/issues/27
//TODO: fix Error handling upgrade request TypeError: Cannot read properties of undefined (reading 'bind')
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Include paths starting with /api (except /api/socket) and /trpc
    "/(api(?!/socket)|trpc)(.*)",
  ],
};
