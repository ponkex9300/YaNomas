"use strict";
/**
 * AWS Lambda Functions para YaNomas Marketplace
 *
 * Estructura esperada en AWS Lambda:
 * - Function: products-get-all
 * - Function: products-get-by-id
 * - Function: products-create
 * - Function: products-update
 * - Function: products-delete
 * - Function: services-get-all
 * - Function: services-get-by-id
 * - Function: services-create
 * - Function: services-update
 * - Function: services-delete
 * - Function: upload-image
 * - Function: delete-image
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorResponse = exports.createSuccessResponse = exports.getCurrentTimestamp = exports.generateId = void 0;
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
exports.generateId = generateId;
const getCurrentTimestamp = () => {
    return new Date().toISOString();
};
exports.getCurrentTimestamp = getCurrentTimestamp;
const createSuccessResponse = (data, statusCode = 200) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
        success: true,
        data,
    }),
});
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (error, statusCode = 400) => ({
    statusCode,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
        success: false,
        error,
    }),
});
exports.createErrorResponse = createErrorResponse;
