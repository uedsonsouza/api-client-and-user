import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import auth from './app/middlewares/auth';
import CustomersController from './app/controllers/CustomersController';
import ContactsController from './app/controllers/ContactsController';
import UserController from './app/controllers/UserController';
import SessionsController from './app/controllers/SessionsController';
import FilesController from './app/controllers/FilesController';

const routes = new Router();
const upload = multer(multerConfig);

/**
 * @swagger
 * /sessions:
 *   post:
 *     summary: Autentica usuário e retorna token JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login bem sucedido
 *       401:
 *         description: Credenciais inválidas
 */
routes.post('/sessions', SessionsController.create);

routes.use(auth);

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Lista clientes
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de clientes }
 */
routes.get('/customers', CustomersController.index);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Detalha um cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Cliente encontrado }
 *       404: { description: Não encontrado }
 */
routes.get('/customers/:id', CustomersController.show);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Cria cliente
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               status: { type: string, example: ACTIVE }
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Erro de validação }
 */
routes.post('/customers', CustomersController.create);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Atualiza cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               status: { type: string }
 *     responses:
 *       200: { description: Atualizado }
 *       400: { description: Erro de validação }
 *       404: { description: Não encontrado }
 */
routes.put('/customers/:id', CustomersController.update);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Remove cliente
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Removido }
 *       404: { description: Não encontrado }
 */
routes.delete('/customers/:id', CustomersController.destroy);

/**
 * @swagger
 * /customers/{customer_id}/contacts:
 *   get:
 *     summary: Lista contatos de um cliente
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lista de contatos }
 */
routes.get('/customers/:customer_id/contacts', ContactsController.index);

/**
 * @swagger
 * /customers/{customer_id}/contacts/{id}:
 *   get:
 *     summary: Detalha contato
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Contato encontrado }
 *       404: { description: Não encontrado }
 */
routes.get('/customers/:customer_id/contacts/:id', ContactsController.show);

/**
 * @swagger
 * /customers/{customer_id}/contacts:
 *   post:
 *     summary: Cria contato
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Erro de validação }
 */
routes.post('/customers/:customer_id/contacts', ContactsController.create);

/**
 * @swagger
 * /customers/{customer_id}/contacts/{id}:
 *   put:
 *     summary: Atualiza contato
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               phone: { type: string }
 *     responses:
 *       200: { description: Atualizado }
 *       404: { description: Não encontrado }
 */
routes.put('/customers/:customer_id/contacts/:id', ContactsController.update);

/**
 * @swagger
 * /customers/{customer_id}/contacts/{id}:
 *   delete:
 *     summary: Remove contato
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Removido }
 *       404: { description: Não encontrado }
 */
routes.delete('/customers/:customer_id/contacts/:id', ContactsController.destroy);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista usuários
 *     tags: [Users]
 *     responses:
 *       200: { description: Lista de usuários }
 */
routes.get('/users', UserController.index);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Detalha usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Usuário encontrado }
 *       404: { description: Não encontrado }
 */
routes.get('/users/:id', UserController.show);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria usuário
 *     tags: [Users]
 *     security: []  # se quiser permitir criação sem login, caso contrário remova
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, passwordConfirmation]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               passwordConfirmation: { type: string }
 *     responses:
 *       201: { description: Criado }
 *       400: { description: Erro de validação }
 */
routes.post('/users', UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               oldPassword: { type: string }
 *               password: { type: string }
 *               confirmPassword: { type: string }
 *     responses:
 *       200: { description: Atualizado }
 *       400: { description: Erro de validação }
 */
routes.put('/users/:id', UserController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204: { description: Removido }
 *       404: { description: Não encontrado }
 */
routes.delete('/users/:id', UserController.destroy);

/**
 * @swagger
 * /files:
 *   post:
 *     summary: Upload de arquivo
 *     tags: [Files]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201: { description: Arquivo salvo }
 *       400: { description: Erro no upload }
 */
routes.post('/files', upload.single('file'), FilesController.create)

export default routes;