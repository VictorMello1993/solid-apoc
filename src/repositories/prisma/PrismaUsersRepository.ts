import { Prisma, User } from "@prisma/client";
import { IUsersRepository } from "../IUsersRepository";
import { prisma } from "../../lib/prisma";

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prisma.user.create({
      data
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    return user;
  }
}
