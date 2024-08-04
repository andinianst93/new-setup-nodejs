import express from "express";

const router = express.Router();

router.get("/api/example", (req, res) => {
  res.send("Hello from example route");
});

export { router as exampleRouter };
