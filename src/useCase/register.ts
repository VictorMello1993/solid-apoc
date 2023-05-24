import { hash } from "bcryptjs";
import { IUsersRepository } from "../repositories/IUsersRepository";

interface RegisterUseCaseRequest{
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const userWithTheSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithTheSameEmail) {
      throw new Error("User already exists with the same email");
    }

    const password_hash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash
    });
  }
}
