import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = router({
    generateAPIKey: protectedProcedure.mutation(async ({ ctx }) => {
        if (!ctx.session?.user.id) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You must be signed in to generate an API key",
            })
        }

        const user = await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
        });

        if (!user) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "You must be signed in to generate an API key",
            })
        }

        const apiKey = [...Array(30)]
            .map((e) => ((Math.random() * 36) | 0).toString(36))
            .join('');

        const update = await ctx.prisma.user.update({
            where: {
                id: ctx.session.user.id,
            },
            data: {
                apiKey,
            },
        });

        if (!update) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to generate API key",
            })
        }

        return apiKey;
    }),
});