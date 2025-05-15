const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all entries
exports.getAllEntries = async (req, res) => {
  try {
    const entries = await prisma.entry.findMany({
      orderBy: { id: "asc" },
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch entries" });
  }
};

// Create a new entry
exports.createEntry = async (req, res) => {
  const { date, type, cashAmount, goldValue, touch, purity } = req.body;

  try {
    const newEntry = await prisma.entry.create({
      data: {
        date: new Date(date),
        type,
        cashAmount: type === "Cash" ? parseFloat(cashAmount) : null,
        goldValue: type === "Gold" ? parseFloat(goldValue) : null,
        touch: type === "Gold" ? parseFloat(touch) : null,
        purity: type === "Gold" ? parseFloat(purity) : 0,
      },
    });
    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create entry" });
  }
};
