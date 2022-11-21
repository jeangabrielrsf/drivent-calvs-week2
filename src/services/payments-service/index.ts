import { notFoundError, requestError, unauthorizedError } from "@/errors";
import { InsertPaymentType } from "@/protocols";
import paymentsRepository from "@/repositories/payments-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { Payment } from "@prisma/client";
import httpStatus from "http-status";
import enrollmentsService from "../enrollments-service";
import ticketsService from "../tickets-service";

async function getPaymentByTicketId(ticketId: number, userId: number): Promise<GetPaymentResult> {
  const ticket = await ticketsService.findTickets(ticketId);
  if (!ticket) {
    throw notFoundError();
  }

  const userEnrollment = await enrollmentsService.getOneWithAddressByUserId(userId);

  if (ticket.enrollmentId != userEnrollment.id) {
    throw unauthorizedError();
  }

  const paymentInfo = await paymentsRepository.findPaymentByTicketId(ticketId);
  if (!paymentInfo) {
    throw notFoundError();
  }
  console.log(paymentInfo);

  return paymentInfo;
}

async function postPayment(paymentBody: InsertPaymentType, userId: number): Promise<GetPaymentResult> {
  if (!paymentBody.tickedId || !paymentBody.cardData) {
    throw requestError(httpStatus.BAD_REQUEST, "BAD_REQUEST");
  }
  const ticket = await ticketsService.findTickets(paymentBody.tickedId);
  if (!ticket) {
    throw notFoundError();
  }
  const userEnrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (userEnrollment.id != ticket.enrollmentId) {
    throw unauthorizedError();
  }

  const paymentResult = {} as PostPaymentResult;
  paymentResult.ticketId = paymentBody.tickedId;
  paymentResult.cardIssuer = paymentBody.cardData.issuer;
  paymentResult.cardLastDigits = paymentBody.cardData.cvv.toString().slice(-4);
  const value = (await ticketsService.getTicketTypeById(paymentResult.ticketId)).price;
  paymentResult.value = value;
  const result = await paymentsRepository.insert(
    paymentResult.value,
    paymentResult.cardIssuer,
    paymentResult.cardLastDigits,
    paymentResult.ticketId,
  );
  await ticketsRepository.updateTicketStatus(paymentBody.tickedId);

  return result;
}

export type GetPaymentResult = Payment;
export type PostPaymentResult = Omit<Payment, "id" | "createdAt" | "updatedAt">;

const paymentsService = {
  getPaymentByTicketId,
  postPayment,
};

export default paymentsService;
