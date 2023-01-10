
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "../../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case "POST":
            post(req, res);
            break;
        default:
            return res.status(405).json({ error: "Method not allowed" });
    }
};

export default restricted;

const post = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.headers.authorization) {
        return res.status(400).json({ error: "Missing authorization header" });
    }

    if (!req.body) {
        return res.status(400).json({ error: "Missing request body" });
    }

    let keys = z.object({
        steps: z.number(),
        date: z.date().default(new Date()),
    }).safeParse(req.body);

    if (!keys.success) {
        return res.status(400).json({ error: keys.error });
    }

    const user = await prisma.user.findUnique({
        where: {
            apiKey: req.headers.authorization,
        },
        include: {
            profile: true
        },
    });

    if (!user) {
        return res.status(400).json({ error: "The API key is not valid" });
    }

    if (!user.profile) {
        return res.status(400).json({ error: "The user has no profile" });
    }

    const stepCount = await prisma.stepCount.create({
        data: {
            steps: keys.data.steps,
            date: keys.data.date,
            profileId: user.profile.id,
        }
    });

    if (!stepCount) {
        return res.status(500).json({ error: "Failed to create step count" });
    }

    return res.status(200).json({ stepCount });
};