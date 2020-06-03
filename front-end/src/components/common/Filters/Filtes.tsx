import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography
} from '@material-ui/core';
import { useFormik } from 'formik';
import { RootStore } from '../../../reducers';
import { StateStatuses } from '../../../utils/State';
import { getPlacesRequested } from '../../../slices/places';
import { restTypeData } from './data';

type Props = {
  selfPosition: any;
};

const useClasses = makeStyles(() => {
  return {
    formClasses: {
      display: 'flex',
      flexDirection: 'column',
      width: 320
    }
  };
});

const Filters: FC<Props> = ({ selfPosition }) => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([{ name: 'category', id: 1 }]);
  const [companySizes, setCompanySizes] = useState([
    {
      name: 'category',
      id: 1
    }
  ]);
  const [costs, setCosts] = useState([{ name: 'category', id: 1 }]);
  const [restDurations, setRestDurations] = useState([
    {
      name: 'category',
      id: 1
    }
  ]);

  const filtersState = useSelector((store: RootStore) => store.filtersState);

  const { formClasses } = useClasses();

  const onSubmit = (val: any) => {
    const { lat: userLatitude, lng: userLongitude } = selfPosition;
    console.log(selfPosition);
    dispatch(getPlacesRequested({ ...val, userLatitude, userLongitude }));
  };

  const {
    values,
    setFieldValue,
    handleChange,
    handleSubmit,
    handleBlur
  } = useFormik({
    initialValues: {
      categories: 0,
      companySizes: 1,
      costs: 1,
      restDurations: 1,
      restType: false,
      distance: 6,
      workingOnly: false
    },
    validationSchema: Yup.object().shape({
      categories: Yup.number().required(),
      companySizes: Yup.number().required(),
      costs: Yup.number().required(),
      restDurations: Yup.number().required(),
      restType: Yup.boolean().required(),
      distance: Yup.number().required(),
      workingOnly: Yup.boolean().required()
    }),
    onSubmit
  });

  const handleSliderChange = (event: any, value: any) => {
    setFieldValue('distance', value);
  };

  useEffect(() => {
    if (filtersState.status === StateStatuses.LOADED) {
      setCategories(filtersState.payload.categories);
      setCompanySizes(filtersState.payload.companySizes);
      setCosts(filtersState.payload.costs);
      setRestDurations(filtersState.payload.restDurations);
    }
  }, [filtersState, values]);

  return (
    <form onSubmit={handleSubmit} className={formClasses}>
      <FormControl>
        <InputLabel>Категорії</InputLabel>
        <Select
          name="categories"
          value={values.categories}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {categories.map((category: any) => {
            return (
              <MenuItem key={`category-${category.id}`} value={category.id}>
                {category.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>К-ть людей</InputLabel>
        <Select
          name="companySizes"
          value={values.companySizes}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {companySizes.map((companySize: any) => {
            return (
              <MenuItem key={companySize.id} value={companySize.id}>
                {companySize.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Ціна</InputLabel>
        <Select
          name="costs"
          value={values.costs}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {costs.map((cost: any) => {
            return (
              <MenuItem key={cost.id} value={cost.id}>
                {cost.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Час відпочинку</InputLabel>
        <Select
          name="costs"
          onChange={handleChange}
          value={values.restDurations}
          onBlur={handleBlur}
        >
          {restDurations.map((duration: any) => {
            return (
              <MenuItem key={duration.id} value={duration.id}>
                {duration.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>{restTypeData.label}</InputLabel>
        <Select
          name="restType"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.restType}
        >
          {restTypeData.options.map((option: any) => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {option.content}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl component="div" style={{ padding: '0 32px' }}>
        <Typography id="discrete-slider" gutterBottom>
          Відстань до закладу
        </Typography>
        <Slider
          name="distance"
          defaultValue={30}
          onChange={handleSliderChange}
          getAriaValueText={() => `${values.distance}`}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={0.5}
          marks
          min={0.5}
          max={6}
        />
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={values.workingOnly}
            onChange={handleChange}
            name="workingOnly"
            color="primary"
          />
        }
        label="Відкрито"
      />
      <Button type="submit">Підібрати заклади</Button>
    </form>
  );
};

export default Filters;
