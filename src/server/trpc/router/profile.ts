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
              orderBy: { date: "desc" },
              take: 1,
            },
            stepCounts: {
              orderBy: { date: "desc" },
              take: 1,
            },
            workoutMinutes: {
              orderBy: { date: "desc" },
              take: 1,
            },
            runningSessions: {
              orderBy: { date: "desc" },
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
  createDailySteps: protectedProcedure
    .input(z.object({
      steps: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          profile: true
        }
      })

      if (!user || !user.profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const stepCount = await ctx.prisma.stepCount.create({
        data: {
          steps: input.steps,
          profileId: user.profile.id,
        }
      })

      return stepCount;
    }),
  createWeight: protectedProcedure
    .input(z.object({
      weight: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          profile: true
        }
      });

      if (!user || !user.profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const weight = await ctx.prisma.weight.create({
        data: {
          weight: input.weight,
          profileId: user.profile.id,
        }
      })

      return weight;
    }),
  createWorkoutMinutes: protectedProcedure
    .input(z.object({
      minutes: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          profile: true
        }
      })

      if (!user || !user.profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const workoutMinutes = await ctx.prisma.workoutMinutes.create({
        data: {
          minutes: input.minutes,
          profileId: user.profile.id,
        }
      });

      return workoutMinutes;
    }),
  createRunningSession: protectedProcedure
    .input(z.object({
      distance: z.number(),
      duration: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      let user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          profile: true
        }
      })

      if (!user || !user.profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      const runningSession = await ctx.prisma.runningSession.create({
        data: {
          distance: input.distance,
          duration: input.duration,
          profileId: user.profile.id,
        }
      });
    }),
  updateProfile: protectedProcedure
    .input(z.object({
      description: z.string().optional(),
      birthday: z.date().optional(),
      height: z.number().optional(),
      cardioFitness: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          profile: true
        }
      })

      if (!user || !user.profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const profile = await ctx.prisma.profile.update({
        where: {
          id: user.profile.id,
        },
        data: input,
      });

      return profile;
    })
});
