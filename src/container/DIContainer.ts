import { PaystackService } from '../services/paystack.service';
import { GiftCodeService } from "./../services/gc.service";
import { AuthService } from "./../services/auth.service";
import { UserController } from "./../controllers/user.ctrl";
import { UserService } from "./../services/user.service";
import { Container } from "inversify";
import { GCCService } from "./../services/gcc.service";
import { TransactionService } from "../services/transaction.service";

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

export default DIContainer;
