import { Controller, Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
}
