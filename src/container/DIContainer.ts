import { AuthService } from "./../services/auth.service";
import { CartItemService } from "./../services/cartItem.service";
import { UserController } from "./../controllers/user.ctrl";
import { UserService } from "./../services/user.service";
import { Container } from "inversify";
import { GCCService } from "./../services/gcc.service";

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
DIContainer.bind<CartItemService>(CartItemService).toSelf();
DIContainer.bind<AuthService>(AuthService).toSelf();

export default DIContainer;
