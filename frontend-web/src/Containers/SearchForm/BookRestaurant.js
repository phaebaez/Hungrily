import React from 'react';
import { Button, Form, Modal, Icon } from 'semantic-ui-react'
import { Formik } from "formik";
import * as yup from "yup";
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/light.css'

import PaxOptions from '../../Data/PaxOptions';


const BookRestaurant = () => (
    <Formik
        initialValues={{
            date: '',
            startTime: '',
            pax: '',
        }}

        onSubmit={(values) => {
            console.log(values);
        }}

        validationSchema={yup.object().shape({
            date: yup.date("Invalid Date")
                .min(new Date(), "Your cannot state a past date"),
            startTime: yup.string(),
            pax: yup.number().min(1).max(20)
        })}

        render={({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
            const handleDropdownChange = (e, { name, value }) => {
                setFieldValue(name, value);
            };

            return (
                <Form size='medium' className='ba b--light-silver pt3 pl3 pr2 appColor'>
                    <Form.Group widths='equal'>
                        <Form.Field>
                            <Flatpickr
                                data-enable-time
                                options={{ minDate: 'today', maxDate: new Date().fp_incr(30) }}
                                placeholder="Reservation Date & Time"
                                onChange={e => setFieldValue('date', e[0])}
                                onBlur={handleBlur}
                                value={values.date}
                                name="date"
                            />
                        </Form.Field>
                        <Form.Select //Dropdown
                            placeholder='Pax'
                            name="pax"
                            options={PaxOptions}
                            value={values.pax}
                            onChange={handleDropdownChange}
                        />
                        <Modal trigger={<Button> Book </Button>}>
                                <Modal.Content>
                                    <p> Confirm this booking? </p>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button color='red' inverted>
                                        <Icon name='remove' /> No
                                    </Button>
                                    <Button color='green' inverted>
                                        <Icon name='checkmark' /> Yes
                                </Button>
                                </Modal.Actions>
                        </Modal>
                    </Form.Group>
                </Form>
            );
        }}
    />
);

export default BookRestaurant;