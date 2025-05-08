const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBill = async (req, res) => {
  try {
    const {
      customerId,
      goldRate,
      hallmarkCharges = 0,
      items,
      receivedDetails,
    } = req.body;

    const totalWeight = items.reduce(
      (sum, item) => sum + item.coinValue * item.quantity,
      0
    );
    const totalPurity = items.reduce((sum, item) => {
      const purity = item.coinValue * item.quantity * (item.percentage / 100);
      return sum + purity;
    }, 0);
    const totalAmount = totalPurity * goldRate + parseFloat(hallmarkCharges);

    const latestBill = await prisma.bill.findFirst({
      orderBy: { id: "desc" },
    });
    const billNo = `BILL-${(latestBill?.id || 0) + 1}`;

    const bill = await prisma.$transaction(async (tx) => {
      const newBill = await tx.bill.create({
        data: {
          billNo,
          customerId,
          goldRate,
          hallmarkCharges,
          totalWeight,
          totalPurity,
          totalAmount,
          items: {
            create: items.map((item) => ({
              coinValue: item.coinValue,
              quantity: item.quantity,
              percentage: item.percentage,
              touch: item.touch,
              weight: item.coinValue * item.quantity,
              purity: item.coinValue * item.quantity * (item.percentage / 100),
              amount:
                item.coinValue *
                item.quantity *
                (item.percentage / 100) *
                goldRate,
            })),
          },
          receivedDetails: {
            create: receivedDetails.map((detail) => ({
              date: new Date(detail.date),
              goldRate: detail.goldRate,
              givenGold: detail.givenGold,
              touch: detail.touch,
              purityWeight: detail.givenGold * (detail.touch / 100),
              amount: detail.givenGold * (detail.touch / 100) * detail.goldRate,
              hallmark: detail.hallmark || 0,
            })),
          },
        },
        include: {
          items: true,
          receivedDetails: true,
          customer: true,
        },
      });

      for (const item of items) {
        await tx.coinStock.updateMany({
          where: {
            coinType: item.percentage.toString(),
            gram: item.coinValue,
          },
          data: {
            quantity: { decrement: item.quantity },
            totalWeight: { decrement: item.coinValue * item.quantity },
          },
        });

        const coinStock = await tx.coinStock.findFirst({
          where: {
            coinType: item.percentage.toString(),
            gram: item.coinValue,
          },
        });

        if (!coinStock) {
          throw new Error(
            `Coin stock not found for coinType: ${item.percentage} and gram: ${item.coinValue}`
          );
        }

        await tx.stockLog.create({
          data: {
            coinType: item.percentage.toString(),
            gram: item.coinValue,
            quantity: -item.quantity,
            changeType: "BILL",
            reason: `Billed in ${billNo}`,
            coinStockId: coinStock.id,
          },
        });
      }

      return newBill;
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ error: "Failed to create bill" });
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

module.exports = {
  createBill,
  getBills,
  getBillById,
};
