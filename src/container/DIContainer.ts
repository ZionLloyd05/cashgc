import { CartService } from "./../services/cart.service";
import { UserController } from "./../controllers/user.ctrl";
import { UserService } from "./../services/user.service";
import { Container } from "inversify";

const DIContainer = new Container();
DIContainer.bind<UserService>(UserService).toSelf();
DIContainer.bind<UserController>(UserController).toSelf();
DIContainer.bind<CartService>(CartService).toSelf();

export default DIContainer;
