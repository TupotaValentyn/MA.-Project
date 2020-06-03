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
      id: 0
    }
  ]);

  const filtersState = useSelector((store: RootStore) => store.filtersState);

  const { formClasses } = useClasses();

  const onSubmit = (val: any) => {
    const { lat: userLatitude, lng: userLongitude } = selfPosition;
    console.log(selfPosition);
    const {
      companySizes: companySize,
      costs: restCost,
      restDurations: restDuration,
      restType,
      distance,
      workingOnly
    } = val;

    dispatch(
      getPlacesRequested({
        categories: val.categories,
        companySize,
        restCost,
        restDuration: val.restDurations,
        restType,
        workingOnly
      })
    );
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
      companySizes: 0,
      costs: 0,
      restDurations: 0,
      restType: false,
      // distance: 6,
      workingOnly: false
    },
    validationSchema: Yup.object().shape({
      categories: Yup.number().required(),
      companySizes: Yup.number().required(),
      costs: Yup.number().required(),
      restDurations: Yup.number().required(),
      restType: Yup.boolean().required(),
      // distance: Yup.number().required(),
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
        <InputLabel>Розмір компанії</InputLabel>
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
        <InputLabel>Тривалість відпочинку</InputLabel>
        <Select
          name="restDurations"
          onChange={handleChange}
          value={values.restDurations}
          onBlur={handleBlur}
        >
          {restDurations.map((duration: any) => {
            console.log(duration);
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
