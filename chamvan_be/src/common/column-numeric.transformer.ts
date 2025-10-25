// src/common/column-numeric.transformer.ts
export class ColumnNumericTransformer {
  to(value?: number | null): number | null {
    // khi ghi xuống DB, TypeORM vẫn chấp nhận number
    return value ?? null;
  }
  from(value?: string | null): number | null {
    // khi đọc từ DB (mysql trả string), convert về number
    if (value === null || value === undefined) return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }
}
