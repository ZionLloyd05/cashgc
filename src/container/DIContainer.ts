import { UserService } from "./../services/user.service";
import { Container } from "inversify";

const DIContainer = new Container();
DIContainer.bind<UserService>(UserService).toSelf();

export default DIContainer;
