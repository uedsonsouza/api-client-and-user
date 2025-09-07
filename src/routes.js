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

routes.post('/sessions', SessionsController.create);
routes.post('/users', UserController.create);

routes.use(auth);

routes.get('/customers', CustomersController.index);
routes.get('/customers/:id', CustomersController.show);
routes.post('/customers', CustomersController.create);
routes.put('/customers/:id', CustomersController.update);
routes.delete('/customers/:id', CustomersController.destroy);
routes.get('/customers/:customer_id/contacts', ContactsController.index);
routes.get('/customers/:customer_id/contacts/:id', ContactsController.show);
routes.post('/customers/:customer_id/contacts', ContactsController.create);
routes.put('/customers/:customer_id/contacts/:id', ContactsController.update);
routes.delete('/customers/:customer_id/contacts/:id', ContactsController.destroy);
routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.destroy);
routes.post('/files', upload.single('file'), FilesController.create)

export default routes;