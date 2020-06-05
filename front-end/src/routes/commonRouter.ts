import Register from '@pages/Register';
import ConfirmEmail from '@pages/ConfirmEmail';
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
  },
  {
    exact: true,
    path: ROUTES.CONFIRM_EMAIL,
    component: ConfirmEmail
  }
];

export default routes;
