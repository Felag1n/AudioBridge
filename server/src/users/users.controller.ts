import { 
    Controller, 
    Get, 
    Put, 
    UseGuards, 
    Param, 
    Body, 
    ParseIntPipe,
    Request 
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { UsersService } from './users.service';
  import { UpdateUserDto } from './dto/update-user.dto';
  
  @Controller('users')
  export class UsersController {
    constructor(private usersService: UsersService) {}
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return this.usersService.findById(req.user.userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Put('profile')
    updateProfile(
      @Request() req,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      return this.usersService.update(req.user.userId, updateUserDto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.findById(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id/liked-tracks')
    getLikedTracks(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.getLikedTracks(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':id/tracks')
    getUploadedTracks(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.getUploadedTracks(id);
    }
  }