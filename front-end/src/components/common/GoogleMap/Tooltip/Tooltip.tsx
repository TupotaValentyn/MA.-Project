import React, { FC } from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type Props = { name: string; self?: boolean };

const useClasses = makeStyles((theme: Theme) => {
  return {
    imageBox: {
      width: 16,
      height: 16,
      objectFit: 'contain',
      cursor: 'pointer'
    },
    imageBoxSelf: {
      width: 24,
      height: 24,
      objectFit: 'contain',
      cursor: 'pointer'
    }
  };
});

const Tooltip: FC<any> = ({ marker, self = false }) => {
  const { imageBox, imageBoxSelf } = useClasses();
  return (
    <div key={marker?.id}>
      <img
        className={self ? imageBoxSelf : imageBox}
        src={self ? '/images/user-location-marker.png' : '/images/marker.png'}
        alt="marker"
      />
    </div>
  );
};

export default Tooltip;
