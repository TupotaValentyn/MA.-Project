import React, { FC } from 'react';
import { Switch, HashRouter } from 'react-router-dom';
import { Router } from '@material-ui/icons';
import { commonRoutes, userRoutes } from './routes';
import Auth from './components/common/Auth/Auth';
import CheckAuthenticated from './components/common/CheckAuthenticated';
import './App.css';

type Props = {};

const App: FC<Props> = () => (
  <div className="App">
    <HashRouter>
      <Auth>
        <Switch>
          {userRoutes.map((route, i: number) => (
            <Router key={route.path} {...route} />
          ))}

          {commonRoutes.map((route, i: number) => (
            <Router key={route.path} {...route} />
          ))}
        </Switch>
        <CheckAuthenticated />
      </Auth>
    </HashRouter>
  </div>
);

export default App;
