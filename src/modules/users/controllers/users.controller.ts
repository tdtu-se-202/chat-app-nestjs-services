import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Body,
  Put,
} from '@nestjs/common';
import { Roles } from '../../auth/decorators/role.decorator';
import { Role } from '../../auth/enums/role.enum';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { UsersService } from '../services/users.service';
import { UpdateUserProfileDto } from '../dtos/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthHelper } from '../../../helpter/auth-helper';

@Controller('users')
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/admin')
  @Roles(Role.Admin)
  test() {
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Get('example')
  example(@Request() req) {
    console.log(AuthHelper.getEmailFromToken(req.headers.authorization));
    return true;
  }

  @Public()
  @Post('/public')
  testPublic() {
    return true;
  }

  @ApiOperation({
    summary: `Get my profile`,
  })
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  me(@Request() req) {
    return this.usersService.findOneByEmail(req.user.email);
  }

  @ApiOperation({
    summary: `Get user information`,
  })
  @ApiOkResponse({
    description: 'User information',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({
    description: `Forbidden. Cannot get user information`,
  })
  @ApiParam({
    type: String,
    name: 'id',
  })
  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({
    summary: `Get user information`,
  })
  @ApiOkResponse({
    description: 'User information',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({
    description: `Forbidden. Cannot get user information`,
  })
  @ApiParam({
    type: String,
    name: 'id',
  })
  @Put('/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserProfileDto) {
    return this.usersService.updateOne(id, dto);
  }

}
