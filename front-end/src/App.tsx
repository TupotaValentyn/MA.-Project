import React, { FC } from 'react';
import './App.css';
import { Login } from './components/pages';
import { BrowserRouter, Switch } from 'react-router-dom';
import { commonRoutes, userRoutes } from './routes';
import { Router } from '@material-ui/icons';
import Auth from './components/common/Auth/Auth';
import CheckAuthenticated from './components/common/CheckAuthenticated';

type Props = {};

const App: FC<Props> = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Auth>
          <Switch>
            {userRoutes.map((route, i: number) => (
              <Router key={i} {...route} />
            ))}

            {commonRoutes.map((route, i: number) => (
              <Router key={i} {...route} />
            ))}
          </Switch>
          <CheckAuthenticated />
        </Auth>
      </BrowserRouter>
    </div>
  );
};

export default App;
