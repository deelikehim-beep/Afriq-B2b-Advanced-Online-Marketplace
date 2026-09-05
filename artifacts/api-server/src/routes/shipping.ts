import { Router } from "express";
import { getRequestUser } from "../lib/request-user";

const router = Router();

router.post("/shipping/rates", async (req, res) => {
  const user = await getRequestUser(req);
  if (!user) return res.status(401).json({ message: "Authentication required." });
  const apiKey = process.env.SHIPPO_API_KEY;
  if (!apiKey) return res.status(503).json({ message: "Shipping provider is not configured." });

  const { addressFrom, addressTo, parcels, currency = "NGN" } = req.body ?? {};
  if (!addressFrom || !addressTo || !Array.isArray(parcels) || parcels.length === 0) {
    return res.status(400).json({ message: "Origin, destination, and at least one parcel are required." });
  }

  const response = await fetch("https://api.goshippo.com/shipments/", {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address_from: addressFrom,
      address_to: addressTo,
      parcels,
      async: false,
      extra: { reference_1: "AFRIQ marketplace order", currency },
    }),
  });
  const payload = await response.json().catch(() => ({})) as Record<string, any>;
  if (!response.ok) return res.status(response.status).json({ message: payload?.detail ?? "Unable to retrieve shipping rates." });
  return res.json({
    shipmentId: payload.object_id,
    rates: (payload.rates ?? []).map((rate: Record<string, unknown>) => ({
      id: rate.object_id,
      provider: rate.provider,
      service: rate.servicelevel_name,
      amount: rate.amount,
      currency: rate.currency,
      estimatedDays: rate.estimated_days,
      checkoutUrl: rate.label_url,
    })),
  });
});

router.get("/shipping/tracking/:carrier/:trackingNumber", async (req, res) => {
  const user = await getRequestUser(req);
  if (!user) return res.status(401).json({ message: "Authentication required." });
  const apiKey = process.env.SHIPPO_API_KEY;
  if (!apiKey) return res.status(503).json({ message: "Shipping provider is not configured." });
  const response = await fetch(`https://api.goshippo.com/tracks/${encodeURIComponent(req.params.carrier)}/${encodeURIComponent(req.params.trackingNumber)}`, {
    headers: { Authorization: `ShippoToken ${apiKey}` },
  });
  const payload = await response.json().catch(() => ({})) as Record<string, any>;
  if (!response.ok) return res.status(response.status).json({ message: payload?.detail ?? "Unable to retrieve tracking." });
  return res.json(payload);
});

export default router;