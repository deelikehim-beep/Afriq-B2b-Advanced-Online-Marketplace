import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stateRouter from "./state";
import shippingRouter from "./shipping";
import backgroundRouter from "./background";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stateRouter);
router.use(shippingRouter);
router.use(backgroundRouter);

export default router;
