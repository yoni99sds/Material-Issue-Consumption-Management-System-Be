"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const router = (0, express_1.Router)();
// In-memory data store for consumptions
let consumptions = [
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
router.get("/", (req, res) => {
    return res.json(consumptions);
});
router.post("/", (req, res) => {
    const data = req.body;
    const newConsumption = {
        ...data,
        id: (0, uuid_1.v4)()
    };
    consumptions.push(newConsumption);
    return res.status(201).json(newConsumption);
});
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const index = consumptions.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Consumption not found" });
    }
    consumptions[index] = { ...consumptions[index], ...updates };
    return res.json(consumptions[index]);
});
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const index = consumptions.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Consumption not found" });
    }
    consumptions.splice(index, 1);
    return res.status(204).send();
});
exports.default = router;
