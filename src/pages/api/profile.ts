import { Profile } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";

import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { prisma } from "../../server/db/client";

const restricted = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!req.headers.authorization) {
    return res.status(400).json({ error: "Missing authorization header" });
  }

  if (!req.body) {
    return res.status(400).json({ error: "Missing request body" });
  }

  let keys: any;
  try {
    keys = z.object({
      profile: z.object({
        description: z.string().optional(),
        weight: z.number().optional(),
        startWeight: z.number().optional(),
        age: z.number().optional(),
        bmi: z.number().optional(),
        cardioFitness: z.number().optional(),
        runningDistance: z.number().optional(),
        steps: z.number().optional(),
        workoutMinutes: z.number().optional(),
      }).strict()
    }).strict().parse(req.body);

    // TODO: add more specific error handling
  } catch (error: any) {
    return res.status(400).json({ error: JSON.parse(error.message) });
  }

  // add timestamps if properties are present
  if (keys.profile.steps) {
    keys.profile.stepsTimestamp = new Date();
  }

  if (keys.profile.runningDistance) {
    keys.profile.runningTimestamp = new Date();
  }

  if (keys.profile.workoutMinutes) {
    keys.profile.workoutTimestamp = new Date();
  }


  const findUser = await prisma.user.findUnique({
    where: {
      apiKey: req.headers.authorization,
    },
  });

  if (!findUser) {
    return res.status(400).json({ error: "Unauthorized API key." });
  }

  const updateUser = await prisma.user.update({
    where: {
      apiKey: req.headers.authorization,
    },
    data: {
      profile: {
        update: {
          ...keys.profile,
        },
      },
    },
  });

  if (!updateUser) {
    res.status(400).json({ error: "Failed to update user profile" });
  }

  // wait three seconds to simulate a slow API
  res.send({
    updated: updateUser.id,
    keys
  });
};

export default restricted;
