import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name required"),
  phone: Yup.string().required("Phone required"),
  email: Yup.string().email("Invalid email"), // optional
  gender: Yup.string().required("Gender required"),
  dateOfBirth: Yup.string().required("DOB required"),
  pin: Yup.string().required("PIN required").length(6),
  state: Yup.string().required("State required"),
  district: Yup.string().required("District required"),
  town: Yup.string().required("Village required"),
  address: Yup.string(), // optional
});

export default function PatientRegister() {
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
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Patient Registration</h1>

      <Formik
        initialValues={{
          fullName: "",
          phone: "",
          email: "",
          gender: "",
          dateOfBirth: "",
          pin: "",
          state: "",
          district: "",
          town: "",
          address: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          alert(JSON.stringify(values, null, 2));
          resetForm();
        }}
      >
        {({ errors, touched, setFieldValue, resetForm }) => (
          <Form>
            <FormContainer>

              {/* ------------ ROW 1 ------------ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                <FormItem
                  label="Full Name"
                  invalid={errors.fullName && touched.fullName}
                  errorMessage={errors.fullName}
                >
                  <Field name="fullName" component={Input} placeholder="Patient Name" />
                </FormItem>

                <FormItem
                  label="Phone"
                  invalid={errors.phone && touched.phone}
                  errorMessage={errors.phone}
                >
                  <Field name="phone" component={Input} placeholder="Phone Number" />
                </FormItem>

                <FormItem
                  label="Email (Optional)"
                >
                  <Field name="email" component={Input} placeholder="Email" />
                </FormItem>

              </div>

              {/* ------------ ROW 2 ------------ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                <FormItem
                  label="Date of Birth"
                  invalid={errors.dateOfBirth && touched.dateOfBirth}
                  errorMessage={errors.dateOfBirth}
                >
                  <Field name="dateOfBirth" type="date" component={Input} />
                </FormItem>

                <FormItem
                  label="Gender"
                  invalid={errors.gender && touched.gender}
                  errorMessage={errors.gender}
                >
                  <Field as="select" name="gender" className="border p-2 rounded w-full">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Field>
                </FormItem>

                <FormItem label="Address (Optional)">
                  <Field name="address" component={Input} placeholder="Full Address" />
                </FormItem>

              </div>

              {/* ------------ ROW 3 ------------ */}
              <h2 className="text-lg font-semibold mt-6">Address Info</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">

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
                      if (e.target.value.length === 6) {
                        fetchPincode(e.target.value, setFieldValue);
                      }
                    }}
                  />
                </FormItem>

                <FormItem
                  label="State"
                  invalid={errors.state && touched.state}
                  errorMessage={errors.state}
                >
                  <Field name="state" component={Input} readOnly className="bg-gray-100" />
                </FormItem>

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

              {/* ------------ ROW 4 ------------ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

                <FormItem label="Taluka (Optional)">
                  <Field as="select" name="taluka" className="border p-2 rounded w-full">
                    <option value="">Select Taluka</option>
                    {talukaList.map((t, i) => (
                      <option key={i} value={t}>{t}</option>
                    ))}
                  </Field>
                </FormItem>

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

              </div>

              {/* ------------ BUTTONS ------------ */}
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
