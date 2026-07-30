import { Request, Response } from 'express';
import { db } from '../db';
import { prisma } from '../prisma';

export class SecurityTestController {

  // 1. SQL Injection Raw
  public async getRawUser(req: Request, res: Response) {
    const email = req.body.email;
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const user = await db.query(query);
    return res.json(user);
  }

  // 2. Prisma Unsafe Raw Query
  public async getPrismaUser(req: Request, res: Response) {
    const role = req.params.role;
    const users = await prisma.$queryRawUnsafe(`SELECT * FROM User WHERE role = '${role}'`);
    return res.json(users);
  }

  // 3. NoSQL Injection
  public async getMongoUser(req: Request, res: Response) {
    const userInput = req.body.input;
    const result = await db.collection('users').find({ $where: "this.name == '" + userInput + "'" });
    return res.json(result);
  }
}
