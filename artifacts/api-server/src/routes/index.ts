import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stateRouter from "./state";
import shippingRouter from "./shipping";
import backgroundRouter from "./background";
import marketplaceRouter from "./marketplace";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stateRouter);
router.use(shippingRouter);
router.use(backgroundRouter);
router.use(marketplaceRouter);

export default router;
