import Register from '@pages/Register';
import ROUTES from './routes';
import { Login } from '../components/pages';

const routes = [
  {
    exact: true,
    path: ROUTES.LOGIN,
    component: Login
  },
  {
    exact: true,
    path: ROUTES.REGISTER,
    component: Register
  }
];

export default routes;
