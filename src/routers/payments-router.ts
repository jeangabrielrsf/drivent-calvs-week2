import { getPaymentInfo, insertPayment } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const paymentsRouter = Router();

paymentsRouter.get("/", authenticateToken, getPaymentInfo);
paymentsRouter.post("/process", authenticateToken, insertPayment);

export { paymentsRouter };
