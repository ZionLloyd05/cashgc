import { DatabaseProvider } from "./../database/index";
import { User, IUserDTO } from "../models/User";
import * as crypto from "crypto";
import config from "../config";

export class UserService {
  public async create(user: User): Promise<IUserDTO> {
    const db = await DatabaseProvider.getConnection();

    let newUser = new User();
    newUser = { ...user };

    newUser.password = this.hashPassword(user.password);
    //console.log(newUser);

    return await db.getRepository(User).save(newUser);
  }

  public async update(user: IUserDTO): Promise<IUserDTO> {
    const db = await DatabaseProvider.getConnection();
    const userRepository = db.getRepository(User);
    let userInDb = await userRepository.findOne(user.id);

    const { firstname, lastname, email, address, city, state, country } = user;
    userInDb.firstname = firstname;
    userInDb.lastname = lastname;
    userInDb.email = email;
    userInDb.address = address;
    userInDb.city = city;
    userInDb.state = state;
    userInDb.country = country;

    return await userRepository.save(userInDb);
  }

  public async getById(id: number): Promise<IUserDTO> {
    const db = await DatabaseProvider.getConnection();

    const userRepository = await db.getRepository(User);
    return userRepository.findOne(id);
  }

  public async getAll(): Promise<IUserDTO[]> {
    const db = await DatabaseProvider.getConnection();
    return await db.getRepository(User).find();
  }

  /**
   * Helper functions
   */
  private hashPassword(password: string): string {
    const algorithm = "aes256";
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const pwd = password;

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(pwd, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }
}
