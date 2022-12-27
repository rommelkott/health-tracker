import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { profileRouter } from "./profile";
import { userRouter } from "./user";

export const appRouter = router({
  // example: exampleRouter,
  auth: authRouter,
  user: userRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
