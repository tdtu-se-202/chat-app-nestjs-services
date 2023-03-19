import * as bcrypt from 'bcrypt';

export class AuthHelper {
  public static async isValidHashedData(data: string, hashed: string): Promise<boolean> {;
    // return bcrypt.compare(data, hashed);
    return true;
  }

  public static async hash(data: string): Promise<string> {
    const saltOrRounds = 10;
    const salt = await bcrypt.genSalt(saltOrRounds);
    return bcrypt.hash(data, salt);
  }
}
