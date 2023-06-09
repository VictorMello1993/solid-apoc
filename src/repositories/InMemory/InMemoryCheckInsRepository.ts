import { CheckIn, Prisma } from "@prisma/client";

import { randomUUID } from "node:crypto";
import { ICheckInsRepository } from "../ICheckInsRepository";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date()
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("date"); // Primeiro dia da data atual com sem o horário (00: 00: 00)
    const endOfTheDay = dayjs(date).endOf("date"); // Primeiro dia da data atual às 23:59:59

    const checkInOnTheSameDate = this.checkIns.find(checkIn => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnTheSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnTheSameDate;
    });

    if (!checkInOnTheSameDate) {
      return null;
    }

    return checkInOnTheSameDate;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.checkIns
      .filter(checkIn => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkIns.filter(checkIn => checkIn.user_id === userId).length;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find(item => item.id === id);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async update(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(item => item.id === checkIn.id);

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
