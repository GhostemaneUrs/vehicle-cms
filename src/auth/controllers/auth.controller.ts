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
import { CreateUserDto, ReadUserDto } from '../dtos/user.dto';
import { LoginDto } from '../dtos/auth.dto';
import { AuthResponseDto } from '../dtos/user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { Public } from '../../common/public.decorator';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cfg: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: ReadUserDto })
  async register(@Body() dto: CreateUserDto): Promise<ReadUserDto> {
    const user = await this.authService.register(dto);
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive tokens in cookies' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiCookieAuth()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      dto.username,
      dto.password,
    );

    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge:
        parseInt(this.cfg.get<string>('config.jwt.accessExpiresIn')) * 1000,
    });

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge:
        parseInt(this.cfg.get<string>('config.jwt.refreshExpiresIn')) * 1000,
    });

    return plainToClass(AuthResponseDto, { accessToken, refreshToken });
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiCookieAuth()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      req.user,
      req.cookies.Refresh,
    );

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return plainToClass(AuthResponseDto, { accessToken, refreshToken });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear tokens' })
  @ApiOkResponse({ type: String })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user.sub);
    res.clearCookie('Authentication');
    res.clearCookie('Refresh');
    return 'Logged out';
  }
}
