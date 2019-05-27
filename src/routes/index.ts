import { UserRoute } from "./user";
import { PublicRoute } from "./public.route";
import { PingRoute } from "./ping";

export const ROUTERS = [new PingRoute(), new PublicRoute(), new UserRoute()];
