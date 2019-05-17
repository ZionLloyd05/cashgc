import { CartService } from "./../services/cart.service";
import { UserController } from "./../controllers/user.ctrl";
import { UserService } from "./../services/user.service";
import { Container } from "inversify";
import { GCCService } from "./../services/gcc.service";

/**
 * New'ing up DI Container
 */
const DIContainer = new Container();

/**
 * Binding up Dependencies
 */
DIContainer.bind<UserService>(UserService).toSelf();
DIContainer.bind<UserController>(UserController).toSelf();
DIContainer.bind<CartService>(CartService).toSelf();
DIContainer.bind<GCCService>(GCCService).toSelf();

export default DIContainer;
