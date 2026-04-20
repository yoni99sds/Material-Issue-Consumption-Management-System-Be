import { Router, Request, Response } from "express";
import { Consumption } from "../models/types";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// In-memory data store for consumptions
let consumptions: Consumption[] = [
  {
    id: "mock-1",
    itemCode: "ITEM-001",
    description: "Sample Material",
    UOM: "KG",
    issuedQty: 100,
    returnedQty: 10,
    wasteQty: 5,
    remark: "Test mock data",
    date: new Date().toISOString().split('T')[0]
  }
];

router.get("/", (req: Request, res: Response) => {
  return res.json(consumptions);
});

router.post("/", (req: Request, res: Response) => {
  const data = req.body as Omit<Consumption, "id">;
  
  const newConsumption: Consumption = {
    ...data,
    id: uuidv4()
  };

  consumptions.push(newConsumption);
  return res.status(201).json(newConsumption);
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body as Partial<Consumption>;
  
  const index = consumptions.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Consumption not found" });
  }

  consumptions[index] = { ...consumptions[index], ...updates };
  return res.json(consumptions[index]);
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = consumptions.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Consumption not found" });
  }

  consumptions.splice(index, 1);
  return res.status(204).send();
});

export default router;
