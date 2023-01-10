import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const profileRouter = router({
  getProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile
        .findUnique({
          where: { userId: input.userId, },
          select: {
            // birthday & height are not returned but used to calculate bmi
            birthday: true,
            height: true,
            description: true,
            cardioFitness: true,
            userId: true,
            weights: {
              orderBy: { date: "asc" },
              take: 1,
            },
            stepCounts: {
              orderBy: { date: "asc" },
              take: 1,
            },
            workoutMinutes: {
              orderBy: { date: "asc" },
              take: 1,
            },
            runningSessions: {
              orderBy: { date: "asc" },
              take: 1,
            }
          }
        })

      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }

      // calculate bmi
      let bmi = profile.weights[0]?.weight && profile.height ?
        Number(((profile.weights[0].weight / (profile.height * profile.height)) * 703).toFixed(2))
        : null;

      bmi = Number(bmi?.toFixed(2));
      // remove birthday & height from profile
      const { birthday, height, ...rest } = profile;

      // calculate age
      const age = birthday ? Math.floor((new Date().getTime() - new Date(birthday).getTime()) / 3.15576e+10) : null;

      // finally return the profile
      return {
        ...rest,
        age,
        bmi
      };
    }),
});
