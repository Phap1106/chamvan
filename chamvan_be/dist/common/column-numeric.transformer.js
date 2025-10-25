"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnNumericTransformer = void 0;
class ColumnNumericTransformer {
    to(value) {
        return value ?? null;
    }
    from(value) {
        if (value === null || value === undefined)
            return null;
        const n = Number(value);
        return Number.isNaN(n) ? null : n;
    }
}
exports.ColumnNumericTransformer = ColumnNumericTransformer;
//# sourceMappingURL=column-numeric.transformer.js.map