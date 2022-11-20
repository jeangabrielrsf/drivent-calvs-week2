import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findTypes() {
  return prisma.ticketType.findMany();
}

const ticketsRepository = {
  findTypes,
};

export default ticketsRepository;
