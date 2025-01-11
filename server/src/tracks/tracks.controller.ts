import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Param, 
    UseGuards,
    Request,
    ParseIntPipe,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { TracksService } from './tracks.service';
  import { CreateTrackDto } from './dto/create-track.dto';
  
  @Controller('tracks')
  export class TracksController {
    constructor(private tracksService: TracksService) {}
  
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req, @Body() createTrackDto: CreateTrackDto) {
      return this.tracksService.create(req.user.userId, createTrackDto);
    }
  
    @Get()
    findAll() {
      return this.tracksService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.tracksService.findOne(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post(':id/like')
    toggleLike(
      @Request() req,
      @Param('id', ParseIntPipe) trackId: number,
    ) {
      return this.tracksService.toggleLike(trackId, req.user.userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post(':id/comments')
    addComment(
      @Request() req,
      @Param('id', ParseIntPipe) trackId: number,
      @Body('content') content: string,
    ) {
      return this.tracksService.addComment(trackId, req.user.userId, content);
    }
  }
  