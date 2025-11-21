import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Clinic name required"),
    clinicType: Yup.string().required("Clinic type required"),
    phone: Yup.string().required("Phone required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    pin: Yup.string().required("PIN required").length(6, "PIN must be 6 digits"),
    state: Yup.string().required("State required"),
    district: Yup.string().required("District required"),
    subDistrict: Yup.string().required("Taluka required"),
    town: Yup.string().required("Village required"),
    address: Yup.string().required("Address required"),
});

export default function ClinicRegister() {
    const [districtList, setDistrictList] = useState([]);
    const [talukaList, setTalukaList] = useState([]);
    const [villageList, setVillageList] = useState([]);

    async function fetchPincode(pin, setFieldValue) {
        if (pin.length !== 6) return;

        try {
            const res = await fetch(
                `https://platform.shauryatechnosoft.com/core-master-service/api/v1/o/pincode?pincode=${pin}`
            );
            const data = await res.json();

            setDistrictList([data?.data?.districtName]);
            setTalukaList(data?.data?.talukaList || []);
            setVillageList(data?.data?.villageList || []);

            setFieldValue("state", data?.data?.stateName);
            setFieldValue("district", data?.data?.districtName);
            setFieldValue("districtCode", data?.data?.districtCode);
            setFieldValue("stateCode", data?.data?.stateCode);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-8">
                Clinic Registration
            </h1>

            <Formik
                initialValues={{
                    name: "",
                    clinicType: "",
                    isActive: true,
                    phone: "",
                    email: "",
                    pin: "",
                    state: "",
                    district: "",
                    subDistrict: "",
                    town: "",
                    address: "",
                    stateCode: "",
                    districtCode: "",
                    subDistrictCode: "",
                    townCode: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    alert(JSON.stringify(values, null, 2));
                    resetForm();
                }}
            >
                {({ errors, touched, resetForm, setFieldValue }) => (
                    <Form>
                        <FormContainer>

                            {/* ROW 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                                {/* Clinic Name */}
                                <FormItem
                                    label="Clinic Name"
                                    invalid={errors.name && touched.name}
                                    errorMessage={errors.name}
                                >
                                    <Field name="name" component={Input} placeholder="Clinic name" />
                                </FormItem>

                                {/* Clinic Type */}
                                <FormItem
                                    label="Clinic Type"
                                    invalid={errors.clinicType && touched.clinicType}
                                    errorMessage={errors.clinicType}
                                >
                                    <Field as="select" name="clinicType" className="border p-2 rounded w-full">
                                        <option value="">Select Clinic Type</option>
                                        <option value="HUMAN">Human</option>
                                        <option value="PET">Pet</option>
                                        <option value="LIVE_STOCK">Live Stock</option>
                                    </Field>
                                </FormItem>

                                {/* Phone */}
                                <FormItem
                                    label="Phone"
                                    invalid={errors.phone && touched.phone}
                                    errorMessage={errors.phone}
                                >
                                    <Field name="phone" component={Input} placeholder="Phone" />
                                </FormItem>

                                {/* Email */}
                                <FormItem
                                    label="Email"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field name="email" type="email" component={Input} placeholder="Email" />
                                </FormItem>
                            </div>

                            {/* ROW 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                                {/* PIN Code */}
                                <FormItem
                                    label="PIN Code"
                                    invalid={errors.pin && touched.pin}
                                    errorMessage={errors.pin}
                                >
                                    <Field
                                        name="pin"
                                        component={Input}
                                        placeholder="Pincode"
                                        onChange={(e) => {
                                            setFieldValue("pin", e.target.value);
                                            fetchPincode(e.target.value, setFieldValue);
                                        }}
                                    />
                                </FormItem>

                                {/* State */}
                                <FormItem
                                    label="State"
                                    invalid={errors.state && touched.state}
                                    errorMessage={errors.state}
                                >
                                    <Field name="state" component={Input} readOnly className="bg-gray-100" />
                                </FormItem>

                                {/* District */}
                                <FormItem
                                    label="District"
                                    invalid={errors.district && touched.district}
                                    errorMessage={errors.district}
                                >
                                    <Field as="select" name="district" className="border p-2 rounded w-full">
                                        <option value="">Select District</option>
                                        {districtList.map((d, i) => (
                                            <option key={i} value={d}>{d}</option>
                                        ))}
                                    </Field>
                                </FormItem>
                            </div>

                            {/* ROW 3 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                                {/* Taluka */}
                                <FormItem
                                    label="Taluka"
                                    invalid={errors.subDistrict && touched.subDistrict}
                                    errorMessage={errors.subDistrict}
                                >
                                    <Field as="select" name="subDistrict" className="border p-2 rounded w-full">
                                        <option value="">Select Taluka</option>
                                        {talukaList.map((t, i) => (
                                            <option key={i} value={t}>{t}</option>
                                        ))}
                                    </Field>
                                </FormItem>

                                {/* Village */}
                                <FormItem
                                    label="Village"
                                    invalid={errors.town && touched.town}
                                    errorMessage={errors.town}
                                >
                                    <Field as="select" name="town" className="border p-2 rounded w-full">
                                        <option value="">Select Village</option>
                                        {villageList.map((v, i) => (
                                            <option key={i} value={v}>{v}</option>
                                        ))}
                                    </Field>
                                </FormItem>

                                {/* Address */}
                                <FormItem
                                    label="Full Address"
                                    invalid={errors.address && touched.address}
                                    errorMessage={errors.address}
                                >
                                    <Field name="address" component={Input} placeholder="Full Address" />
                                </FormItem>
                            </div>

                            {/* BUTTONS */}
                            <FormItem className="mt-6">
                                <Button type="reset" className="mr-3" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit">
                                    Submit
                                </Button>
                            </FormItem>

                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
