import React, { FC } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Router } from '@material-ui/icons';
import { commonRoutes, userRoutes } from './routes';
import Auth from './components/common/Auth/Auth';
import CheckAuthenticated from './components/common/CheckAuthenticated';
import './App.css';

type Props = {};

const App: FC<Props> = () => {
  return (
    <div className="App">
      <BrowserRouter>
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
      </BrowserRouter>
    </div>
  );
};

export default App;
