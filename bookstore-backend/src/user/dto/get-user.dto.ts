import { ApiProperty } from '@nestjs/swagger';

export class GetUserDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  tel: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  isActive: boolean;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
