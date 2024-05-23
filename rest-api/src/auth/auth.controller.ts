import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as password from 'password-hash-and-salt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';
//import { Model } from 'mongoose';

@Controller('login')
export class AuthController {
  constructor(@InjectModel('User') private userModel) {}

  @Post()
  async login(
    @Body('email') email: string,
    @Body('password') plaintextPassword: string,
  ) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      console.log('User does exist on the database.');
      throw new UnauthorizedException();
    }

    return new Promise((resolve, reject) => {
      // if (plaintextPassword === user.passwordHash) {
      //   console.log('Password verified: ', plaintextPassword);
      //   console.log('DB Password Verified: ', user.passwordHash);
      //   const authJwtToken = jwt.sign({ email, roles: user.roles }, JWT_SECRET);
      //   console.log(authJwtToken);
      //   resolve({ authJwtToken });
      // } else {
      //   console.log('Incorrect Password: ', plaintextPassword);
      //   console.log('Incorrect DB Password: ', user.passwordHash);
      //   reject(new UnauthorizedException());
      // }
      password(plaintextPassword).verifyAgainst(
        user.passwordHash,
        (err, verified) => {
          if (!verified) {
            console.log('Incorrect Password: ', plaintextPassword);
            //console.log('Incorrect Password: ', user.passwordHash);
            reject(new UnauthorizedException());
          } else {
            console.log('Password verified: ', plaintextPassword);
            console.log('DB Password Verified: ', user.passwordHash);
          }
          const authJwtToken = jwt.sign(
            { email, roles: user.roles },
            JWT_SECRET,
          );
          //console.log(authJwtToken);
          resolve({ authJwtToken });
        },
      );
    });
  }
}
