import * as bcrypt from "bcrypt";
import config from "config/config";
import { fromUnixTime } from "date-fns";
import { UnprocessableEntityError } from "errors/errors";
import { decode, sign } from "jsonwebtoken";
import { UsersService } from "modules/users/users.service";
import { FindOptionsWhere, Repository } from "typeorm";
import { LoginUserDto } from "./dto/login-user.dto";
import { AccessToken } from "./entities/access-token.entity";
import dataSource from "orm/orm.config";

export class AuthService {
  private readonly accessTokenRepository: Repository<AccessToken>;
  private readonly usersService: UsersService;

  constructor() {
    this.accessTokenRepository = dataSource.getRepository(AccessToken);
    this.usersService = new UsersService();
  }

  public async login(data: LoginUserDto): Promise<AccessToken> {
    const user = await this.usersService.findOneBy({ email: data.email });

    if (!user) throw new UnprocessableEntityError("Invalid user email or password");

    const isValidPassword = await this.validatePassword(data.password, user.hashedPassword);

    if (!isValidPassword) throw new UnprocessableEntityError("Invalid user email or password");

    let token = ""
 
    const newToken = this.accessTokenRepository.create({
      token,
      user,
      expiresAt: fromUnixTime(new Date().getTime()),
    });

    const entity = await this.accessTokenRepository.save(newToken);

     token = sign(
      {
        id: user.id,
        email: user.email,
        tokenId: entity.id
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_AT },
    );

    const tokenExpireDate = this.getJwtTokenExpireDate(token);

    entity.token = token
    entity.expiresAt = fromUnixTime(tokenExpireDate)

    await this.accessTokenRepository.update(
      entity.id, entity
    );

    return entity
  }

  private getJwtTokenExpireDate(token: string): number {
    const { exp } = decode(token) as { [exp: string]: number };
    return exp;
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async findOneBy(param: FindOptionsWhere<AccessToken>): Promise<AccessToken | null> {
    return this.accessTokenRepository.findOneBy({ ...param });
  }
}
