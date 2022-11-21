import { prisma } from "@/config";
import { InsertPaymentType } from "@/protocols";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function insert(value: number, cardIssuer: string, cardLastDigits: string, ticketId: number) {
  return prisma.payment.create({
    data: {
      value,
      cardIssuer,
      cardLastDigits,
      ticketId,
    },
  });
}

const paymentsRepository = {
  findPaymentByTicketId,
  insert,
};

export default paymentsRepository;
