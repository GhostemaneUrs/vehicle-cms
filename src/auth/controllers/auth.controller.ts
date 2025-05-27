import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { CreateUserDto, ReadUserDto } from '../dtos/user.dto';
import { LoginDto } from '../dtos/auth.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

declare global {
  namespace Express {
    interface Request {
      user?: ReadUserDto;
    }
  }
}

@ApiHeader({
  name: 'x-tenant-id',
  description: 'Tenant identifier (schema name)',
  required: true,
})
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: ReadUserDto })
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ReadUserDto> {
    console.log('🚀 ~ AuthController ~ dto:', dto);
    const user = await this.userService.create(dto);
    const { token } = await this.authService.login(user);

    res.cookie('Authentication', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 3600 * 1000,
    });
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ type: ReadUserDto })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ReadUserDto> {
    const user = await this.authService.validateUser(dto);
    const { token } = await this.authService.login(user);

    res.cookie('Authentication', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 3600 * 1000,
    });

    return plainToClass(ReadUserDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiOkResponse({ type: ReadUserDto })
  getProfile(@Req() req: Request): ReadUserDto {
    return req.user as ReadUserDto;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiOkResponse({ type: String })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication', { path: '/' });
    return 'Logged out';
  }
}
