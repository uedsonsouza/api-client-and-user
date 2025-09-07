import swaggerUi from 'swagger-ui-express';
import swaggerDocs from '../docs/swagger.json' assert { type: 'json' };

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Clientes e Usuários - Documentação'
  }));
};