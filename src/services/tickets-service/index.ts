import ticketsRepository from "@/repositories/tickets-repository";
import { TicketType } from "@prisma/client";

async function findTicketsTypes(): Promise<GetTicketTypesResult[]> {
  const result = await ticketsRepository.findTypes();

  return result;
}

export type GetTicketTypesResult = Omit<TicketType, "createdAt" | "updatedAt">;

const ticketsService = {
  findTicketsTypes,
};

export default ticketsService;
