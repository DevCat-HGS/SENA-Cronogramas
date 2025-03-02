const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'CTPGA Management API',
      version: '1.0.0',
      description: 'API para el sistema de gestión CTPGA',
      contact: {
        name: 'SENA CTPGA',
      },
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Servidor de desarrollo'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './models/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerDocs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'CTPGA API Documentation'
  }),
  swaggerDocs
};