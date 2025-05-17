const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBill = async (req, res) => {
  try {
    const { customerId, goldRate, items = [], receivedDetails = [] } = req.body;

    if (!customerId || !goldRate || !items.length) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const enrichedItems = items.map((item) => {
      const weight = item.coinValue * item.quantity;
      const purity = weight * (item.percentage / 100);
      const amount = purity * goldRate;

      return {
        ...item,
        weight,
        purity,
        amount,
      };
    });

    const totalWeight = enrichedItems.reduce(
      (sum, item) => sum + item.weight,
      0
    );
    const totalPurity = enrichedItems.reduce(
      (sum, item) => sum + item.purity,
      0
    );
    const totalAmount =
      totalPurity * goldRate + parseFloat(req.body.hallmarkCharges || 0);

    const latestBill = await prisma.bill.findFirst({ orderBy: { id: "desc" } });
    const billNo = `BILL-${(latestBill?.id || 0) + 1}`;

    const validReceivedDetails = receivedDetails
      .filter((detail) => {
        return (
          (detail.givenGold && detail.touch) ||
          (detail.amount && (detail.goldRate || goldRate))
        );
      })
      .map((detail) => {
        const goldRateToUse = detail.goldRate || goldRate;

        const givenGold = parseFloat(detail.givenGold) || 0;
        const touch = parseFloat(detail.touch) || 0;
        const inputAmount = parseFloat(detail.amount) || 0;
        const hallmark = parseFloat(detail.hallmark) || 0;

        let amount = inputAmount;
        let purityWeight = 0;

        if (givenGold > 0 && touch > 0) {
          purityWeight = givenGold * (touch / 100);
          amount = purityWeight * goldRateToUse;
        } else if (inputAmount > 0 && goldRateToUse > 0) {
          purityWeight = inputAmount / goldRateToUse;
        }

        return {
          date: new Date(detail.date || new Date()),
          goldRate: goldRateToUse,
          givenGold,
          touch,
          purityWeight,
          amount,
          hallmark,
        };
      });

    const bill = await prisma.$transaction(async (tx) => {
      const newBill = await tx.bill.create({
        data: {
          billNo,
          customerId,
          goldRate,
          hallmarkCharges: parseFloat(req.body.hallmarkCharges || 0),
          totalWeight,
          totalPurity,
          totalAmount,
          items: { create: enrichedItems },
          receivedDetails: {
            create: validReceivedDetails,
          },
        },
        include: { items: true, receivedDetails: true },
      });

      for (const item of items) {
        await tx.coinStock.updateMany({
          where: {
            coinType: item.percentage.toString(),
            gram: item.coinValue,
          },
          data: {
            quantity: { decrement: item.quantity },
          },
        });
      }

      return newBill;
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error("Error creating bill:", error.message);
    res.status(500).json({ error: error.message || "Failed to create bill" });
  }
};


const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: true,
        items: true,
        receivedDetails: true,
      },
    });

    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    res.json(bill);
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ error: "Failed to fetch bill" });
  }
};
const getBills = async (req, res) => {
  try {
    const bills = await prisma.bill.findMany({
      include: {
        customer: true,
        items: true,
        receivedDetails: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bills" });
  }
};
const addReceiveEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { receivedDetails = [], goldRate } = req.body;

    if (!receivedDetails.length) {
      return res.status(400).json({ error: "No receive details provided" });
    }

    const existingBill = await prisma.bill.findUnique({
      where: { id: parseInt(id) },
      include: { receivedDetails: true },
    });

    if (!existingBill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    const validReceivedDetails = receivedDetails
      .filter((detail) => {
        return (
          (detail.givenGold && detail.touch) ||
          (detail.amount &&
            (detail.goldRate || goldRate || existingBill.goldRate))
        );
      })
      .map((detail) => {
        const goldRateToUse =
          detail.goldRate || goldRate || existingBill.goldRate;

        const givenGold = parseFloat(detail.givenGold) || 0;
        const touch = parseFloat(detail.touch) || 0;
        const inputAmount = parseFloat(detail.amount) || 0;
        const hallmark = parseFloat(detail.hallmark) || 0;

        let amount = inputAmount;
        let purityWeight = 0;

        if (givenGold > 0 && touch > 0) {
          purityWeight = givenGold * (touch / 100);
          amount = purityWeight * goldRateToUse;
        } else if (inputAmount > 0 && goldRateToUse > 0) {
          purityWeight = inputAmount / goldRateToUse;
        }

        return {
          date: new Date(detail.date || new Date()),
          goldRate: goldRateToUse,
          givenGold,
          touch,
          purityWeight,
          amount,
          hallmark,
        };
      });

    const updatedBill = await prisma.bill.update({
      where: { id: parseInt(id) },
      data: {
        receivedDetails: {
          create: validReceivedDetails,
        },

        totalAmount: {
          increment: validReceivedDetails.reduce(
            (sum, detail) => sum + detail.amount,
            0
          ),
        },
      },
      include: {
        customer: true,
        items: true,
        receivedDetails: true,
      },
    });

    res.status(200).json(updatedBill);
  } catch (error) {
    console.error("Error adding receive entry:", error);
    res.status(500).json({ error: "Failed to add receive entry" });
  }
};

module.exports = {
  createBill,
  getBills,
  getBillById,
  addReceiveEntry,
};
