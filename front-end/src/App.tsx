import React, { FC } from 'react';
import './App.css';
import { Login } from './components/pages';

type Props = {};

const App: FC<Props> = () => {
  return (
    <div className="App">
      <Login />
    </div>
  );
};

export default App;
