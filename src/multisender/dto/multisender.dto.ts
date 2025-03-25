import { IsArray, IsString, IsNotEmpty, ValidateNested, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

// DTOs for Validation
export class BatchItemDto {
    @IsString()
    @IsNotEmpty()
    recipient: string;

    @IsString()
    @IsNotEmpty()
    amount: string;
}

export class SendEthBatchDto {
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(200)
    @Type(() => BatchItemDto)
    batch: BatchItemDto[];
}

export class SendTokenBatchDto {
    @IsString()
    @IsNotEmpty()
    tokenAddress: string;

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @ArrayMaxSize(200)
    @Type(() => BatchItemDto)
    batch: BatchItemDto[];
}
