import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { jwtVerify } from "@/http/middlewares/jwtVerify";
import { profile } from "./profile";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);
  app.get("/me", { onRequest: [jwtVerify] }, profile);
}
