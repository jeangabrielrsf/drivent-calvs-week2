import { AuthenticatedRequest } from "@/middlewares";
import ticketsService from "@/services/tickets-service";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { getEnrollmentByUser } from "./enrollments-controller";

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypes = await ticketsService.findTicketsTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({});
  }
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const tickets = await ticketsService.findTickets(userId);

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    if (error.name == "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({});
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body;
  if (!ticketTypeId) {
    return res.status(httpStatus.BAD_REQUEST).send({});
  }
  const { userId } = req;

  try {
    const result = await ticketsService.insertTicket(ticketTypeId, userId);
    return res.status(httpStatus.CREATED).send(result);
  } catch (error) {
    if (error.name == "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
  }
}
