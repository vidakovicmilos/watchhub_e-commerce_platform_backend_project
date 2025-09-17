import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get(<string>'JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    if (!payload) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Token is missing required information');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) throw new UnauthorizedException('User no longer exists');

    user.password = 'NOT_VISABLE_HERE';
    return user;
  }
}
