import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name required"),
    phone: Yup.string().required("Phone required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    gender: Yup.string().required("Gender required"),
    role: Yup.string().required("Role required"),
    clinicId: Yup.string().required("Clinic required"),
});

export default function StaffRegister() {

    const clinicList = [
        { id: "clinic1", name: "One Health Clinic" },
        { id: "clinic2", name: "City Health Center" },
    ];

    const roles = [
        "Receptionist",
        "Nurse",
        "Helper",
        "Ward Boy",
        "Manager",
        "Accountant",
        "Lab Technician",
        "Cleaner",
        "Other",
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-8">
                Staff Registration
            </h1>

            <Formik
                initialValues={{
                    fullName: "",
                    phone: "",
                    email: "",
                    gender: "",
                    role: "",
                    clinicId: "",
                    address: "",
                    dateOfJoining: "",
                    emergencyContact: "",
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

                            {/* ---------------- ROW 1 ---------------- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                                <FormItem
                                    label="Full Name"
                                    invalid={errors.fullName && touched.fullName}
                                    errorMessage={errors.fullName}
                                >
                                    <Field name="fullName" component={Input} placeholder="Staff Full Name" />
                                </FormItem>

                                <FormItem
                                    label="Phone"
                                    invalid={errors.phone && touched.phone}
                                    errorMessage={errors.phone}
                                >
                                    <Field name="phone" component={Input} placeholder="Phone" />
                                </FormItem>

                                <FormItem
                                    label="Email"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field name="email" component={Input} placeholder="Email" />
                                </FormItem>

                            </div>

                            {/* ---------------- ROW 2 ---------------- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                                <FormItem
                                    label="Gender"
                                    invalid={errors.gender && touched.gender}
                                    errorMessage={errors.gender}
                                >
                                    <Field as="select" name="gender" className="border p-2 rounded w-full">
                                        <option value="">Select Gender</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </Field>
                                </FormItem>

                                <FormItem
                                    label="Role"
                                    invalid={errors.role && touched.role}
                                    errorMessage={errors.role}
                                >
                                    <Field as="select" name="role" className="border p-2 rounded w-full">
                                        <option value="">Select Role</option>
                                        {roles.map((r, i) => (
                                            <option key={i} value={r}>{r}</option>
                                        ))}
                                    </Field>
                                </FormItem>

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

                            </div>

                            {/* ---------------- ROW 3 ---------------- */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">

                                <FormItem label="Address (Optional)">
                                    <Field name="address" component={Input} placeholder="Full Address" />
                                </FormItem>

                                <FormItem label="Date of Joining (Optional)">
                                    <Field name="dateOfJoining" type="date" component={Input} />
                                </FormItem>

                                <FormItem label="Emergency Contact (Optional)">
                                    <Field
                                        name="emergencyContact"
                                        component={Input}
                                        placeholder="Emergency Contact No."
                                    />
                                </FormItem>

                            </div>

                            {/* ---------------- BUTTONS ---------------- */}
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
