import { notFoundError } from "@/errors";
import enrollmentsService from "../enrollments-service";
import ticketsRepository, { CreateTicket } from "@/repositories/tickets-repository";
import { Ticket, TicketType } from "@prisma/client";

async function findTicketsTypes(): Promise<GetTicketTypesResult[]> {
  const result = await ticketsRepository.findTypes();

  return result;
}

export type GetTicketTypesResult = TicketType;

type FindTicketsResult = Ticket;

async function findTickets(userId: number): Promise<FindTicketsResult> {
  const userEnrollment = await enrollmentsService.getOneWithAddressByUserId(userId);

  const tickets = await ticketsRepository.findTickets(userEnrollment.id);
  if (!tickets) {
    throw notFoundError();
  }
  const ticketType = getTicketTypeById(tickets.ticketTypeId);

  return tickets;
}

async function insertTicket(ticketTypeId: number, userId: number) {
  const ticketType = await getTicketTypeById(ticketTypeId);

  const userEnrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  const insertType = {} as CreateTicket;
  insertType.enrollmentId = userEnrollment.id;
  insertType.ticketTypeId = ticketTypeId;
  insertType.status = "RESERVED";
  const result = await ticketsRepository.insert(insertType);

  return result;
}

async function getTicketTypeById(ticketTypeId: number): Promise<GetTicketTypesResult> {
  const ticketType = ticketsRepository.findTicketTypeById(ticketTypeId);
  if (!ticketType) throw notFoundError();
  return ticketType;
}
const ticketsService = {
  insertTicket,
  findTicketsTypes,
  findTickets,
};

export default ticketsService;
