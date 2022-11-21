import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import { Response } from "express";
import httpStatus, { BAD_REQUEST } from "http-status";
import { InsertPaymentType } from "@/protocols";

export async function getPaymentInfo(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId } = req.query;
    const { userId } = req;
    if (!ticketId) {
      return res.sendStatus(BAD_REQUEST);
    }
    const payment = await paymentsService.getPaymentByTicketId(Number(ticketId), userId);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name == "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name == "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
  }
}

export async function insertPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const paymentBody: InsertPaymentType = req.body;
    const { userId } = req;
    const result = await paymentsService.postPayment(paymentBody, userId);
    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    if (error.name == "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if (error.name == "RequestError") {
      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
    if (error.name == "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
  }
}
