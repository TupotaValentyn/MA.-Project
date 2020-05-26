import React, { FC } from 'react';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type Props = { name: string };

const useClasses = makeStyles((theme: Theme) => {
  return {
    imageBox: {
      width: 16,
      height: 16,
      objectFit: 'contain',
      cursor: 'pointer'
    }
  };
});

const Tooltip: FC<any> = ({ marker }) => {
  const { imageBox } = useClasses();
  return (
    <div key={marker.id}>
      <img className={imageBox} src="/images/marker.png" alt="marker" />
    </div>
  );
};

export default Tooltip;
