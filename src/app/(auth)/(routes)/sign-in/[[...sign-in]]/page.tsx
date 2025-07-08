import { SignIn } from "@clerk/nextjs";

//TODO: JWT issued at date claim (iat) is in the future. Issued at date: (reason=token-iat-in-the-future, token-carrier=cookie). give error tips or fix it
function page() {
  return <SignIn></SignIn>;
}

export default page;
