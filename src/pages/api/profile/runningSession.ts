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

const post = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.headers.authorization) {
        return res.status(400).json({ error: "Missing authorization header" });
    }

    if (!req.body) {
        return res.status(400).json({ error: "Missing request body" });
    }

    let keys = z.object({
        distance: z.number(),
        duration: z.number(),
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
            profile: true,
        },
    });

    if (!user) {
        return res.status(400).json({ error: "The API key is not valid" });
    }

    if (!user.profile) {
        return res.status(400).json({ error: "The user has no profile" });
    }

    const runningSession = await prisma.runningSession.create({
        data: {
            distance: keys.data.distance,
            duration: keys.data.duration,
            date: keys.data.date,
            profileId: user.profile.id,
        }
    });

    if (!runningSession) {
        return res.status(500).json({ error: "Could not create running session" });
    }

    return res.status(200).json({ runningSession });
}

export default restricted;

