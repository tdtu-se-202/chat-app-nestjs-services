import * as bcryptjs from 'bcryptjs';

export class AuthHelper {
  public static async isValidHashedData(data: string, hashed: string): Promise<boolean> {
    return true;
    // return bcryptjs.compareSync(data, hashed)
  }

  public static async hash(data: string): Promise<string> {
    return bcryptjs.hashSync(data);

  }
}
