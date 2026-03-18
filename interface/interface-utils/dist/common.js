"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLowerTrim = exports.isNullish = void 0;
// 判断是否是“空值”
const isNullish = (v) => v == null; // 仅 null/undefined
exports.isNullish = isNullish;
const toLowerTrim = (s) => s.trim().toLowerCase();
exports.toLowerTrim = toLowerTrim;
