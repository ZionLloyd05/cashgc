import { GiftCodeCategory } from "./../models/GiftCodeCategory";
import { injectable, inject } from "inversify";
import { GCCService } from "../services/gcc.service";

@injectable()
export class GccController {
  private _gccService: GCCService;

  constructor(@inject(GCCService) gccService: GCCService) {
    /**
     * Declaring DIs */
    this._gccService = gccService;
  }

  public async saveUser(
    gcCategory: GiftCodeCategory
  ): Promise<GiftCodeCategory> {
    if (gcCategory.id && gcCategory.id != null) {
      // update giftCodeCategory logic
      return await this._gccService.update(gcCategory);
    } else {
      // create giftCodeCategory logic
      const newGcc = await this._gccService.create(gcCategory);
      return newGcc;
    }
  }

  public async getGccById(id: number): Promise<GiftCodeCategory> {
    return await this._gccService.getById(id);
  }

  public async getAllGCCs(): Promise<GiftCodeCategory[]> {
    return await this._gccService.getAll();
  }
}
