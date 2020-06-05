import React, { FC, useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { SwipeableDrawer } from '@material-ui/core';
import Filters from '../Filters';

type Anchor = 'top' | 'left' | 'bottom' | 'right';
type Props = {};
type SelfLocationType = {
  lat: number;
  lng: number;
};

const Header: FC<Props> = () => {
  const [state, setState] = React.useState(false);
  const [selfLocation, setSelfLocation] = useState<SelfLocationType>({
    lng: 0,
    lat: 0
  });

  useEffect(() => {
    // setInterval(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const {
        coords: { latitude, longitude }
      } = position;
      setSelfLocation({ lat: latitude, lng: longitude });
    });
    // }, 3000);
  }, []);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState(open);
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          onKeyDown={toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <SwipeableDrawer
        anchor="right"
        open={state}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        style={{ padding: 16 }}
      >
        <Filters selfPosition={selfLocation} />
      </SwipeableDrawer>
    </AppBar>
  );
};

export default Header;
