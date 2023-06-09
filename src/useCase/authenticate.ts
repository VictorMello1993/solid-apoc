import { User } from "@prisma/client";
import { IUsersRepository } from "../repositories/IUsersRepository";
import { InvalidCredentialsError } from "./errors/InvalidCredentialsError";
import { compare } from "bcryptjs";

interface AuthenticateUseCaseRequest{
  email: string
  password: string
}

interface AuthenticateUseCaseResponse{
  user: User
}

export class AuthenticateUseCase {
  constructor(
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordIsMatch = await compare(password, user.password_hash);

    if (!passwordIsMatch) {
      throw new InvalidCredentialsError();
    }

    return {
      user
    };
  }
}
