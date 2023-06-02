import { expect, it, describe, beforeEach, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "../repositories/InMemory/InMemoryCheckInsRepository";
import { ValidateCheckInUseCase } from "./validateCheckIn";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate check-in use case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    // vi.useFakeTimers(); // Antes de executar cada teste, os valores da data serão fictícias
  });

  afterEach(() => {
    // vi.useRealTimers(); // Depois de ter rodado cada teste, os valores da data passam ser reais
  });

  it("It should be able to validate check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01"
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.checkIns[0].validated_at).toEqual(expect.any(Date));
  });

  it("It should not be able to validate an inexistent check-in", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "user-01"
    });

    await expect(() => sut.execute({
      checkInId: "inexistent-id"
    })).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
