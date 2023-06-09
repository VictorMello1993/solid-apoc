import { describe, afterAll, beforeAll, it, expect } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/createAndAuthenticateUser";
import { prisma } from "@/lib/prisma";

describe("Validate check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("It should be able to validate check-in", async () => {
    const user = await prisma.user.findFirstOrThrow();

    const { token } = await createAndAuthenticateUser(app);

    // Insert manual da academia
    const gym = await prisma.gym.create({
      data: {
        name: "Javascript Gym",
        latitude: -23.0096896,
        longitude: -43.4798592
      }
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id
      }
    });

    const checkInResponse = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -23.0096896,
        longitude: -43.4798592
      });

    expect(checkInResponse.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id
      }
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
});
