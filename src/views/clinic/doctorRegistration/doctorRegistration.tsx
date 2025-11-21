// Doctor Registration Form (Styled similar to ClinicRegister)
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required("Name required"),
  username: Yup.string().required("Username required"),
  password: Yup.string().required("Password required").min(6),
  emailId: Yup.string().email("Invalid email").required("Email required"),
  mobileNumber: Yup.string().required("Mobile required"),
  clinicId: Yup.string().required("Clinic required"),
  sex: Yup.string().required("Gender required"),
  qualifications: Yup.string().required("Qualification required"),
});

export default function DoctorRegister() {
  const [clinicList] = useState([
    { id: "clinic1", name: "One Health Clinic" },
    { id: "clinic2", name: "City Health Center" },
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Doctor Registration</h1>

      <Formik
        initialValues={{
          fullName: "",
          username: "",
          password: "",
          emailId: "",
          mobileNumber: "",
          sex: "",
          clinicId: "",
          qualifications: "",
          licenseNumber: "",
          yearsOfExperience: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          alert(JSON.stringify(values, null, 2));
          resetForm();
        }}
      >
        {({ errors, touched, resetForm }) => (
          <Form>
            <FormContainer>

              {/* --------------- ROW 1 ---------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Full Name */}
                <FormItem
                  label="Full Name"
                  invalid={errors.fullName && touched.fullName}
                  errorMessage={errors.fullName}
                >
                  <Field name="fullName" component={Input} placeholder="Doctor name" />
                </FormItem>

                {/* Username */}
                <FormItem
                  label="Username"
                  invalid={errors.username && touched.username}
                  errorMessage={errors.username}
                >
                  <Field name="username" component={Input} placeholder="Username" />
                </FormItem>

                {/* Password */}
                <FormItem
                  label="Password"
                  invalid={errors.password && touched.password}
                  errorMessage={errors.password}
                >
                  <Field name="password" type="password" component={Input} placeholder="Password" />
                </FormItem>

                {/* Email */}
                <FormItem
                  label="Email"
                  invalid={errors.emailId && touched.emailId}
                  errorMessage={errors.emailId}
                >
                  <Field name="emailId" type="email" component={Input} placeholder="Email" />
                </FormItem>

                {/* Mobile Number */}
                <FormItem
                  label="Mobile Number"
                  invalid={errors.mobileNumber && touched.mobileNumber}
                  errorMessage={errors.mobileNumber}
                >
                  <Field name="mobileNumber" component={Input} placeholder="Mobile" />
                </FormItem>

                {/* Gender */}
                <FormItem
                  label="Gender"
                  invalid={errors.sex && touched.sex}
                  errorMessage={errors.sex}
                >
                  <Field as="select" name="sex" className="border p-2 rounded w-full">
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </Field>
                </FormItem>

              </div>

              {/* --------------- ROW 2 ---------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                {/* Clinic */}
                <FormItem
                  label="Clinic"
                  invalid={errors.clinicId && touched.clinicId}
                  errorMessage={errors.clinicId}
                >
                  <Field as="select" name="clinicId" className="border p-2 rounded w-full">
                    <option value="">Select Clinic</option>
                    {clinicList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Field>
                </FormItem>

                {/* Qualifications */}
                <FormItem
                  label="Qualifications"
                  invalid={errors.qualifications && touched.qualifications}
                  errorMessage={errors.qualifications}
                >
                  <Field name="qualifications" component={Input} placeholder="e.g. MBBS, BVSc" />
                </FormItem>

                {/* License Number (Optional) */}
                <FormItem
                  label={
                    <>
                      License Number{" "}
                      <span className="text-gray-500 text-sm">(Optional)</span>
                    </>
                  }
                >
                  <Field name="licenseNumber" component={Input} placeholder="License No." />
                </FormItem>

              </div>

              {/* --------------- ROW 3 ---------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                {/* Experience Optional */}
                <FormItem
                  label={
                    <>
                      Years of Experience{" "}
                      <span className="text-gray-500 text-sm">(Optional)</span>
                    </>
                  }
                >
                  <Field name="yearsOfExperience" type="number" component={Input} placeholder="Years" />
                </FormItem>

              </div>

              {/* --------------- BUTTONS ---------------- */}
              <FormItem className="mt-6">
                <Button type="reset" className="mr-3" onClick={() => resetForm()}>
                  Reset
                </Button>
                <Button variant="solid" type="submit">Submit</Button>
              </FormItem>

            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
}
