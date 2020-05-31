import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import { useFormik } from 'formik';
import { RootStore } from '../../../reducers';
import { StateStatuses } from '../../../utils/State';
import { getPlacesRequested } from '../../../slices/places';

type Props = {};

const useClasses = makeStyles(() => {
  return {
    formClasses: {
      display: 'flex',
      flexDirection: 'column',
      width: 320
    }
  };
});

const Filters: FC<Props> = () => {
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
    dispatch(getPlacesRequested(val));
  };

  const {
    values,
    errors,
    setFieldValue,
    handleChange,
    handleSubmit,
    handleBlur
  } = useFormik({
    initialValues: {
      categories: 1,
      companySizes: 1,
      costs: 1,
      restDurations: 1
    },
    validationSchema: Yup.object().shape({
      categories: Yup.number().required(),
      companySizes: Yup.number().required(),
      costs: Yup.number().required(),
      restDurations: Yup.number().required()
    }),
    onSubmit
  });

  useEffect(() => {
    if (filtersState.status === StateStatuses.LOADED) {
      setCategories(filtersState.payload.categories);
      setCompanySizes(filtersState.payload.companySizes);
      setCosts(filtersState.payload.costs);
      setRestDurations(filtersState.payload.restDurations);
    }

    console.log(values);
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
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default Filters;
