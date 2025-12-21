
// // src/products/dto/create-product.dto.ts
// import { Transform, Type } from 'class-transformer';
// import {
//   IsArray,
//   IsIn,
//   IsInt,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   Min,
//   ValidateNested,
// } from 'class-validator';

// class ColorDto {
//   @IsString()
//   @IsNotEmpty()
//   name!: string;

//   @IsOptional()
//   @IsString()
//   hex?: string;
// }

// class SpecDto {
//   @IsString()
//   @IsNotEmpty()
//   label!: string;

//   @IsString()
//   @IsNotEmpty()
//   value!: string;
// }

// export class CreateProductDto {
//   @IsString()
//   @IsNotEmpty()
//   name!: string;

//   @IsOptional()
//   @IsString()
//   slug?: string;

//   /**
//    * ✅ cho phép FE gửi number hoặc string
//    * BE vẫn normalize bằng toMoney()
//    */
//   @Transform(({ value }) => (value === null || value === undefined ? value : String(value)))
//   @IsString()
//   price!: string;

//   @IsOptional()
//   @Transform(({ value }) => (value === null || value === undefined ? value : String(value)))
//   @IsString()
//   original_price?: string | null;

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   discount_percent?: number;

//   @IsOptional()
//   @IsString()
//   sku?: string;

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   stock?: number;

//   @IsOptional()
//   @IsIn(['open', 'closed'])
//   status?: 'open' | 'closed';

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   sold?: number;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   /**
//    * ✅ KHÔNG dùng IsUrl vì bạn dùng /uploads/...
//    */
//   @IsOptional()
//   @IsString()
//   image?: string;

//   /**
//    * ✅ cho phép string[] hoặc object[] (upload trả {url,thumb})
//    */
//   @IsOptional()
//   @IsArray()
//   images?: any[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => ColorDto)
//   colors?: ColorDto[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => SpecDto)
//   specs?: SpecDto[];

//   /**
//    * ✅ tương thích cả 2 key: categoryIds (mới) và categories (cũ FE đang gửi)
//    */
//   @IsOptional()
//   @IsArray()
//   categoryIds?: (number | string)[];

//   @IsOptional()
//   @IsArray()
//   categories?: (number | string)[];
// }






// // src/products/dto/create-product.dto.ts
// import { Transform, Type } from 'class-transformer';
// import {
//   registerDecorator,
//   ValidationArguments,
//   ValidationOptions,
//   IsArray,
//   IsIn,
//   IsInt,
//   IsNotEmpty,
//   IsOptional,
//   IsString,
//   Min,
//   ValidateNested,
// } from 'class-validator';

// /**
//  * ✅ Validate ảnh: chỉ cho phép URL hợp lệ (http/https hoặc /uploads/...)
//  * ❌ Chặn tuyệt đối base64 data:image/...
//  */
// function IsAllowedImageUrl(validationOptions?: ValidationOptions) {
//   return function (object: any, propertyName: string) {
//     registerDecorator({
//       name: 'IsAllowedImageUrl',
//       target: object.constructor,
//       propertyName,
//       options: validationOptions,
//       validator: {
//         validate(value: any, _args: ValidationArguments) {
//           if (value === null || value === undefined || value === '') return true;

//           const s = String(value).trim();
//           if (!s) return true;

//           // ❌ block base64
//           if (s.startsWith('data:image/')) return false;

//           // ✅ allow absolute url or uploads path
//           if (s.startsWith('http://') || s.startsWith('https://')) return true;
//           if (s.startsWith('/uploads/') || s.startsWith('/uploads')) return true;

//           return false;
//         },
//         defaultMessage(args: ValidationArguments) {
//           return `${args.property} không hợp lệ: chỉ chấp nhận URL (http/https hoặc /uploads/...), không chấp nhận base64 data:image/*`;
//         },
//       },
//     });
//   };
// }

// class ColorDto {
//   @IsString()
//   @IsNotEmpty()
//   name!: string;

//   @IsOptional()
//   @IsString()
//   hex?: string;
// }

// class SpecDto {
//   @IsString()
//   @IsNotEmpty()
//   label!: string;

//   @IsString()
//   @IsNotEmpty()
//   value!: string;
// }

// export class CreateProductDto {
//   @IsString()
//   @IsNotEmpty()
//   name!: string;

//   @IsOptional()
//   @IsString()
//   slug?: string;

//   /**
//    * ✅ cho phép FE gửi number hoặc string
//    * BE vẫn normalize bằng toMoney()
//    */
//   @Transform(({ value }) =>
//     value === null || value === undefined ? value : String(value),
//   )
//   @IsString()
//   price!: string;

//   @IsOptional()
//   @Transform(({ value }) =>
//     value === null || value === undefined ? value : String(value),
//   )
//   @IsString()
//   original_price?: string | null;

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   discount_percent?: number;

//   @IsOptional()
//   @IsString()
//   sku?: string;

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   stock?: number;

//   /**
//    * ✅ Fix lỗi 400: cho phép FE gửi open (admin UI đang gửi)
//    * Đồng thời vẫn tương thích các flow cũ: active/inactive/closed
//    */
//   @IsOptional()
//   @IsString()
//   @IsIn(['active', 'inactive', 'open', 'closed'])
//   status?: 'active' | 'inactive' | 'open' | 'closed';

//   @IsOptional()
//   @IsInt()
//   @Min(0)
//   sold?: number;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   /**
//    * ✅ ảnh chính: chỉ nhận URL (http/https hoặc /uploads/...)
//    * ❌ không nhận base64
//    */
//   @IsOptional()
//   @IsString()
//   @IsAllowedImageUrl()
//   image?: string;

//   /**
//    * ✅ gallery: nhận string[] hoặc object[] (upload có thể trả {url,src,path})
//    * - Tự normalize về string[]
//    * - Validate từng phần tử: chỉ nhận URL, chặn base64
//    */
//   @IsOptional()
//   @IsArray()
//   @Transform(({ value }) => {
//     if (!Array.isArray(value)) return value;
//     return value
//       .map((x) => {
//         if (!x) return '';
//         if (typeof x === 'string') return x;
//         if (typeof x === 'object') {
//           return String(x.url || x.href || x.src || x.path || '').trim();
//         }
//         return String(x).trim();
//       })
//       .filter((s) => typeof s === 'string' && s.trim().length > 0);
//   })
//   @IsString({ each: true })
//   @IsAllowedImageUrl({ each: true })
//   images?: string[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => ColorDto)
//   colors?: ColorDto[];

//   @IsOptional()
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => SpecDto)
//   specs?: SpecDto[];

//   /**
//    * ✅ tương thích cả 2 key: categoryIds (mới) và categories (cũ FE đang gửi)
//    */
//   @IsOptional()
//   @IsArray()
//   categoryIds?: (number | string)[];

//   @IsOptional()
//   @IsArray()
//   categories?: (number | string)[];
// }




//src/products/dto/create-product.dto.ts
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * ✅ Chỉ cho phép:
 * - http(s)://...
 * - /uploads/...
 * ❌ Cấm tuyệt đối:
 * - data:image/... (base64)
 */
@ValidatorConstraint({ name: 'IsAllowedImageUrl', async: false })
class IsAllowedImageUrlConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (value === null || value === undefined || value === '') return true;
    if (typeof value !== 'string') return false;

    const s = value.trim();
    if (!s) return true;

    // ❌ chặn base64
    if (s.startsWith('data:image/')) return false;

    // ✅ cho phép path uploads
    if (s.startsWith('/uploads/')) return true;

    // ✅ cho phép url http/https
    try {
      const u = new URL(s);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Ảnh phải là URL http(s) hoặc đường dẫn /uploads/... và không được là base64';
  }
}

export function IsAllowedImageUrl(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsAllowedImageUrl',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsAllowedImageUrlConstraint,
    });
  };
}

export class CreateColorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  hex?: string;
}

export class CreateSpecDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  value?: string;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  // FE đang gửi number => dùng Type(() => Number) để validate OK
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  original_price?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  discount_percent?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sold?: number;

  /**
   * ✅ DB đang dùng open/closed (theo product.entity.ts)
   * FE của bạn đang gửi status: "open"
   */
  @IsOptional()
  @IsString()
  @IsIn(['open', 'closed'])
  status?: 'open' | 'closed';

  /**
   * Ảnh chính: URL hoặc /uploads/...
   * ❌ không base64
   */
  @IsOptional()
  @IsString()
  @IsAllowedImageUrl()
  image?: string;

  /**
   * Gallery: array URL hoặc /uploads/...
   * ❌ không base64
   */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsAllowedImageUrl({ each: true })
  images?: string[];

  /**
   * FE có thể gửi categories: [5,4,6,2]
   * hoặc categoryIds: [..] (service sẽ normalize)
   */
  @IsOptional()
  @IsArray()
  categories?: (number | string)[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateColorDto)
  colors?: CreateColorDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSpecDto)
  specs?: CreateSpecDto[];
}
