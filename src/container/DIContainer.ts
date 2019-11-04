import { PayoutVendor } from "./../models/PayoutVendor";
import { SharedService } from "./../services/shared.service";
import { AccountService } from "./../services/account.service";
import { OrderService } from "./../services/order.service";
import { RateService } from "./../services/rate.service";
import { PaystackService } from "../services/paystack.service";
import { GiftCodeService } from "./../services/gc.service";
import { AuthService } from "./../services/auth.service";
import { UserController } from "./../controllers/user.ctrl";
import { UserService } from "./../services/user.service";
import { Container } from "inversify";
import { GCCService } from "./../services/gcc.service";
import { TransactionService } from "../services/transaction.service";
import { OrderItemService } from "./../services/orderItem.service";

/**
 * Dependency Injection Container
 */
const DIContainer = new Container();

/**
 * Binding up Dependencies
 */
DIContainer.bind<UserService>(UserService).toSelf();
DIContainer.bind<UserController>(UserController).toSelf();
DIContainer.bind<GCCService>(GCCService).toSelf();
DIContainer.bind<AuthService>(AuthService).toSelf();
DIContainer.bind<GiftCodeService>(GiftCodeService).toSelf();
DIContainer.bind<TransactionService>(TransactionService).toSelf();
DIContainer.bind<PaystackService>(PaystackService).toSelf();
DIContainer.bind<RateService>(RateService).toSelf();
DIContainer.bind<OrderService>(OrderService).toSelf();
DIContainer.bind<OrderItemService>(OrderItemService).toSelf();
DIContainer.bind<AccountService>(AccountService).toSelf();
DIContainer.bind<SharedService>(SharedService).toSelf();
DIContainer.bind<PayoutVendor>(PayoutVendor).toSelf();

export default DIContainer;
