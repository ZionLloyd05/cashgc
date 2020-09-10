import { createQueryBuilder } from 'typeorm';
import { Rate } from './../models/Rate';
import { DatabaseProvider } from './../database/index';
import { injectable } from 'inversify';

@injectable()
export class RateService {
  public async create(ratePayload): Promise<any> {
    console.log(ratePayload);
    const db = await DatabaseProvider.getConnection();

    let { localrate } = ratePayload;

    let newRate = new Rate();
    newRate.localrate = localrate;
    newRate.isactive = false;

    console.log(newRate);

    return await db.getRepository(Rate).save(newRate);
  }

  public async update(ratePayload): Promise<any> {
    const db = await DatabaseProvider.getConnection();
    const rateRepo = db.getRepository(Rate);

    let rateInDb = await this.getRateById(ratePayload.id);

    let { localrate } = ratePayload;

    rateInDb.localrate = localrate;

    return await rateRepo.save(rateInDb);
  }

  public async getAllRate(): Promise<any> {
    const db = await DatabaseProvider.getConnection();
    return await db
      .getRepository('rate')
      .createQueryBuilder('rate')
      .orderBy({
        'rate.id': 'DESC',
      })
      .getMany();
  }

  public async getRateById(id: number): Promise<any> {
    const db = await DatabaseProvider.getConnection();

    const rateRepo = await db.getRepository(Rate);
    return await rateRepo.findOne(id);
  }

  public async getActiveRate(): Promise<any> {
    const db = await DatabaseProvider.getConnection();
    const rateRepo = db.getRepository(Rate);

    return await createQueryBuilder('Rate')
      .where('Rate.isactive = :isactive', { isactive: true })
      .getOne();
  }

  public async activateRate(rateId: number): Promise<any> {
    let error;
    const db = await DatabaseProvider.getConnection();
    const rateRepo = db.getRepository(Rate);

    let activeRate = await this.getActiveRate();

    if (activeRate && Object.keys(activeRate).length > 0) {
      error = 'Cannot have double activated rates';
      return error;
    }

    let rateInDb = await this.getRateById(rateId);

    rateInDb.isactive = true;

    return await rateRepo.save(rateInDb);
  }

  public async deactivateRate(rateId: number): Promise<any> {
    let error;
    const db = await DatabaseProvider.getConnection();
    const rateRepo = db.getRepository(Rate);

    let rateInDb = await this.getRateById(rateId);

    rateInDb.isactive = false;

    return await rateRepo.save(rateInDb);
  }

  public async removeRate(rateId: number): Promise<any> {
    const db = await DatabaseProvider.getConnection();
    const rateRepo = db.getRepository(Rate);

    let rateToRemove = await this.getRateById(rateId);
    await rateRepo.remove(rateToRemove);
  }

  public async convertDollarToNaira(amountInDollar: number): Promise<number> {
    let response = await this.getActiveRate();
    let { localrate } = response;

    return amountInDollar * localrate;
  }
}
