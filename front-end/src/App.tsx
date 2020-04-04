import React, { FC } from 'react';
import './App.css';
import { Button } from '@material-ui/core';

type Props = {};

const App: FC<Props> = () => {
  return (
    <div className="App">
      <Button color="primary" variant="contained">
        text
      </Button>
    </div>
  );
};

export default App;
