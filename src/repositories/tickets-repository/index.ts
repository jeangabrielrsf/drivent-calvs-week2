import { prisma } from "@/config";
import { Prisma, Ticket, TicketType } from "@prisma/client";

async function findTypes() {
  return prisma.ticketType.findMany();
}

async function findTickets(enrollmentId: number) {
  return prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollmentId,
    },
    include: {
      TicketType: true,
    },
  });
}

async function insert(createdTicket: CreateTicket) {
  return prisma.ticket.upsert({
    create: createdTicket,
    update: createdTicket,
    where: {
      id: 0,
    },
    include: {
      TicketType: true,
    },
  });
}

async function findTicketTypeById(ticketTypeId: number) {
  return prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId,
    },
  });
}

export type CreateTicket = Omit<Ticket, "id" | "createdAt" | "updatedAt">;
export type UpdateTicket = Omit<CreateTicket, "enrolmentId">;

const ticketsRepository = {
  findTypes,
  findTickets,
  findTicketTypeById,
  insert,
};

export default ticketsRepository;
