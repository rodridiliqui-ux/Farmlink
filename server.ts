import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Multicaixa Express
  app.post("/api/payments/mcx-express", async (req, res) => {
    const { phoneNumber, amount, orderId } = req.body;

    if (!phoneNumber || !amount || !orderId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`Initiating MCX Express payment for ${phoneNumber} - Amount: ${amount} - Order: ${orderId}`);

    // In a real scenario, you would call the EMIS / Gateway API here.
    // Example: 
    // const response = await fetch('https://api.emis.co.ao/v1/payments', { ... });
    
    // Simulating a successful initiation
    // The user would then receive a push notification on their phone.
    
    setTimeout(() => {
      // In a real app, this would be a webhook from the payment provider
      console.log(`Payment confirmed for ${orderId}`);
    }, 5000);

    res.json({ 
      status: "initiated", 
      message: "Pagamento iniciado. Por favor, confirme no seu Multicaixa Express.",
      transactionId: `MCX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
