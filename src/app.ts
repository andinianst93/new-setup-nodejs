import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import "dotenv/config";
import { exampleRouter } from "./routes/example";
import { errorHandler } from "@adntickets/common";
import { NotFoundError } from "@adntickets/common";
import ipRangeCheck from "ip-range-check";

const app = express();

// List of Cloudflare IP ranges
const cloudflareIps = [
  "173.245.48.0/20",
  "103.21.244.0/22",
  "103.22.200.0/22",
  "103.31.4.0/22",
  "141.101.64.0/18",
  "108.162.192.0/18",
  "190.93.240.0/20",
  "188.114.96.0/20",
  "197.234.240.0/22",
  "198.41.128.0/17",
  "162.158.0.0/15",
  "104.16.0.0/13",
  "104.24.0.0/14",
  "172.64.0.0/13",
  "131.0.72.0/22",
];

// Trust proxies if the IP falls within the Cloudflare ranges
app.set("trust proxy", (ip: string) => {
  return ipRangeCheck(ip, cloudflareIps);
});

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    sameSite: "strict",
    httpOnly: true,
    path: "/",
  })
);

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log("Cookies:", req.headers.cookie);
  next();
});

app.use(exampleRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
