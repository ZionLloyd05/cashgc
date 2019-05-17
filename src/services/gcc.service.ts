import { GiftCodeCategory } from "../models/GiftCodeCategory";
import { injectable } from "inversify";
import { DatabaseProvider } from "../database/index";

@injectable()
export class GCCService {
  public async create(gcCategory: GiftCodeCategory): Promise<GiftCodeCategory> {
    const db = await DatabaseProvider.getConnection();

    let newGCCategory = new GiftCodeCategory();
    newGCCategory = { ...gcCategory };

    return await db.getRepository(GiftCodeCategory).save(newGCCategory);
  }

  public async update(gcCategory: GiftCodeCategory): Promise<GiftCodeCategory> {
    const db = await DatabaseProvider.getConnection();
    const gccRepository = db.getRepository(GiftCodeCategory);
    let gccInDb = await gccRepository.findOne(gcCategory.id);

    const { title, imageUrl, sellingPrice, buyingPrice, prefix } = gcCategory;
    gccInDb.title = title;
    gccInDb.imageUrl = imageUrl;
    gccInDb.sellingPrice = sellingPrice;
    gccInDb.buyingPrice = buyingPrice;
    gccInDb.prefix = prefix;

    return await gccRepository.save(gccInDb);
  }

  public async getById(id: number): Promise<GiftCodeCategory> {
    const db = await DatabaseProvider.getConnection();

    const gccRepository = await db.getRepository(GiftCodeCategory);
    return gccRepository.findOne(id);
  }

  public async getAll(): Promise<GiftCodeCategory[]> {
    const db = await DatabaseProvider.getConnection();
    return await db.getRepository(GiftCodeCategory).find();
  }
}
