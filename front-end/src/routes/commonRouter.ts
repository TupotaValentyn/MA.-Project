import ROUTES from './routes';
import { Login } from '../components/pages';

const routes = [
  {
    exact: true,
    path: ROUTES.LOGIN,
    component: Login
  }
];

export default routes;
