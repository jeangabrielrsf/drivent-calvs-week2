import { createTicket, getTickets, getTicketsTypes } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketsRouter = Router();

ticketsRouter
  .get("/types", authenticateToken, getTicketsTypes)
  .get("/", authenticateToken, getTickets)
  .post("/", authenticateToken, createTicket);

export { ticketsRouter };
