import React, { FC } from 'react';
import { Box, Theme, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip as MatTooltip } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';

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
    },
    tooltip: {
      backgroundColor: 'rgba(255,255,255, .9)'
    }
  };
});

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      maxWidth: 400
    },
    firstColumn: {
      margin: '0 16px 0 0',
      color: 'black'
    },
    fields: {
      display: 'flex',
      alignItems: 'center'
    }
  };
});

const ExtendedTooltip: FC<{ marker: any }> = ({ marker }) => {
  console.log(marker);

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box className={classes.fields}>
        <Typography
          className={classes.firstColumn}
          variant="caption"
          color="textSecondary"
        >
          Назва :
        </Typography>

        <Typography variant="body1" color="secondary">
          {marker?.name}
        </Typography>
      </Box>

      <Box className={classes.fields}>
        <Typography
          className={classes.firstColumn}
          variant="caption"
          color="textSecondary"
        >
          Рейтинг Google:
        </Typography>

        <Typography variant="caption" color="textSecondary">
          <Rating
            name="rating"
            defaultValue={2.5}
            precision={0.1}
            value={marker?.googleMeanRating}
          />
        </Typography>
      </Box>

      <Box className={classes.fields}>
        <Typography
          className={classes.firstColumn}
          variant="caption"
          color="textSecondary"
        >
          Кількість відгуків :
        </Typography>

        <Typography variant="body1" color="secondary">
          {marker?.googleReviewsCount}
        </Typography>
      </Box>

      <Box className={classes.fields}>
        <Typography
          className={classes.firstColumn}
          variant="caption"
          color="textSecondary"
        >
          Відкрито зараз :
        </Typography>

        <Typography variant="body1" color="secondary">
          {marker?.isWorkingNow ? 'Так' : 'Ні'}
        </Typography>
      </Box>
      <Box className={classes.fields}>
        <Typography
          className={classes.firstColumn}
          variant="caption"
          color="textSecondary"
        >
          Ціна :
        </Typography>

        <Typography variant="body1" color="secondary">
          {marker?.restCost?.name || ''}
        </Typography>
      </Box>

      <Box className={classes.fields}>
        <Typography
          className={classes.firstColumn}
          variant="caption"
          color="textSecondary"
        >
          Рейтинг Rest-Finder:
        </Typography>

        <Typography variant="caption" color="textSecondary">
          <Rating
            name="meanRating"
            defaultValue={0}
            precision={0.1}
            value={marker?.meanRating}
          />
        </Typography>
      </Box>
    </div>
  );
};

const Tooltip: FC<any> = ({ marker, self = false }) => {
  const { imageBox, imageBoxSelf, tooltip } = useClasses();
  return (
    <MatTooltip
      interactive
      classes={{ tooltip }}
      key={marker?.name}
      title={
        (marker?.name && <ExtendedTooltip marker={marker} />) || 'You are here'
      }
    >
      <div key={marker?.id}>
        <img
          className={self ? imageBoxSelf : imageBox}
          src={self ? '/images/user-location-marker.png' : '/images/marker.png'}
          alt="marker"
        />
      </div>
    </MatTooltip>
  );
};

export default Tooltip;
