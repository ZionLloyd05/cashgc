import { CartItem } from "./../models/CartItem";
import { injectable } from "inversify";
import { DatabaseProvider } from "../database/index";
import { createQueryBuilder } from "typeorm";

@injectable()
export class CartItemService {
  public async create(cartItem: CartItem): Promise<CartItem> {
    const db = await DatabaseProvider.getConnection();

    let newCartItem = new CartItem();
    newCartItem = { ...cartItem };

    return await db.getRepository(CartItem).save(newCartItem);
  }

  public async update(cartItem: CartItem): Promise<CartItem> {
    const db = await DatabaseProvider.getConnection();
    const cartItemRepository = db.getRepository(CartItem);
    let cartItemInDb = await cartItemRepository.findOne(cartItem.id);

    const { quantity, total } = cartItem;
    cartItemInDb.quantity = quantity;
    cartItemInDb.total = total;

    return await cartItemRepository.save(cartItemInDb);
  }

  public async getItem(
    cartId?: number,
    gccId?: number,
    userId?: number
  ): Promise<CartItem | CartItem[]> {
    const db = await DatabaseProvider.getConnection();

    if (cartId && gccId == null && userId == null) {
      return await this.getById(cartId);
    } else if (gccId && userId && cartId == null) {
      return await this.getItem();
    }
  }

  public async getById(ItemId: number): Promise<CartItem> {
    const db = await DatabaseProvider.getConnection();

    const cartItemRepository = await db.getRepository(CartItem);
    return cartItemRepository.findOne(ItemId);
  }

  private async getItemByGccUser(gccId: number, userId: number): Promise<any> {
    const db = await DatabaseProvider.getConnection();

    const cartItemRepository = db.getRepository(CartItem);
    const cartItem = await createQueryBuilder("cartItem").innerJoinAndSelect(
      "cartItem.giftCodeCategory",
      "gcc",
      "gcc.id = :id",
      { id: gccId }
    );

    return cartItem;
  }

  public async getAll(): Promise<CartItem[]> {
    const db = await DatabaseProvider.getConnection();
    return await db.getRepository(CartItem).find();
  }
}
