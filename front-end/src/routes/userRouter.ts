import ROUTES from './routes';
import { Overview } from '../components/pages';

const routes = [
  {
    exact: true,
    path: ROUTES.OVERVIEW,
    component: Overview
  }
];

export default routes;
