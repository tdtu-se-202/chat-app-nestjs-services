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
import { UsersService } from '../services/users.service';
import { UpdateUserProfileDto } from '../dtos/update-user.dto';
import { AccessTokenGuard } from "../../auth/guards/access-token.guard";

@Controller('users')
@ApiBearerAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/admin')
  @Roles(Role.Admin)
  test() {
    return true;
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
  @UseGuards(AccessTokenGuard)
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
  @UseGuards(AccessTokenGuard)
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserProfileDto) {
    return this.usersService.updateOne(id, dto);
  }

  @ApiOperation({
    summary: `Upload user's avatar`,
  })
  @ApiOkResponse({
    description: 'Upload avatar successful',
  })
  @ApiParam({
    type: String,
    name: 'id',
  })
  @Put('/:id')
  @UseGuards(AccessTokenGuard)
  uploadAvatar(@Param('id') id: string, @Body() dto: UpdateUserProfileDto) {
    return false;
  }

}
