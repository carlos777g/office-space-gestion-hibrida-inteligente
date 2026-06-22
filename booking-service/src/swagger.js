// OpenAPI 3 specification for booking-service, served at /api-docs.
const swaggerJSDoc = require('swagger-jsdoc');

const bookingSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer', example: 12 },
    space_id: { type: 'integer', example: 1 },
    user_id: { type: 'integer', example: 2 },
    start_time: { type: 'string', format: 'date-time', example: '2026-06-23T09:00:00.000Z' },
    end_time: { type: 'string', format: 'date-time', example: '2026-06-23T10:00:00.000Z' },
    attendees: { type: 'integer', example: 4 },
    status: { type: 'string', enum: ['ACTIVE', 'CANCELLED'], example: 'ACTIVE' },
    created_at: { type: 'string', format: 'date-time' },
  },
};

const definition = {
  openapi: '3.0.3',
  info: {
    title: 'OfficeSpace — Booking Service API',
    version: '1.0.0',
    description:
      'Autenticación (JWT) y motor de reservas con detección de solapamientos. ' +
      '`POST /auth/login` es público; el resto requiere `Authorization: Bearer <token>`.',
  },
  servers: [{ url: 'http://localhost:3002', description: 'Local / Docker' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Booking: bookingSchema,
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@corporativoalpha.com' },
          password: { type: 'string', example: 'Admin123' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni', description: 'JWT' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              email: { type: 'string', example: 'admin@corporativoalpha.com' },
              role: { type: 'string', example: 'ADMIN' },
              full_name: { type: 'string', example: 'Admin Alpha' },
            },
          },
        },
      },
      BookingInput: {
        type: 'object',
        required: ['space_id', 'start_time', 'end_time', 'attendees'],
        properties: {
          space_id: { type: 'integer', example: 1 },
          start_time: { type: 'string', format: 'date-time', example: '2026-06-23T09:00:00.000Z' },
          end_time: { type: 'string', format: 'date-time', example: '2026-06-23T10:00:00.000Z' },
          attendees: { type: 'integer', minimum: 1, example: 4 },
        },
      },
      Error: {
        type: 'object',
        properties: { error: { type: 'string', example: 'Time slot is already booked' } },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Login y emisión de JWT' },
    { name: 'Bookings', description: 'Reservas del usuario' },
    { name: 'Health', description: 'Estado del servicio' },
  ],
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login — devuelve JWT',
        security: [],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } },
        },
        responses: {
          200: { description: 'Autenticado', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
          401: { description: 'Credenciales inválidas', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/bookings/my': {
      get: {
        tags: ['Bookings'],
        summary: 'Mis reservas',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Reservas del usuario autenticado', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Booking' } } } } },
          401: { description: 'Sin token' },
        },
      },
    },
    '/bookings': {
      post: {
        tags: ['Bookings'],
        summary: 'Crear reserva (con validación de solapamiento)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/BookingInput' } } },
        },
        responses: {
          201: { description: 'Reserva creada', content: { 'application/json': { schema: { $ref: '#/components/schemas/Booking' } } } },
          400: { description: 'Validación fallida (fechas, aforo, etc.)' },
          401: { description: 'Sin token' },
          409: { description: 'Conflicto: el horario ya está reservado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/bookings/{id}': {
      delete: {
        tags: ['Bookings'],
        summary: 'Cancelar reserva (propia; ADMIN cancela cualquiera)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Cancelada' },
          401: { description: 'Sin token' },
          403: { description: 'No es tu reserva' },
          404: { description: 'No encontrada' },
        },
      },
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        security: [],
        responses: { 200: { description: 'Servicio operativo' } },
      },
    },
  },
};

module.exports = swaggerJSDoc({ definition, apis: [] });
