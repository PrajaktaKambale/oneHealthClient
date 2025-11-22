import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import useStaffRegistration from "@/utils/hooks/useStaffRegistration";
import { apiGetClinicsByTenant, apiGetRoles } from "@/services/StaffService";
import type { StaffFormData, ClinicByTenant, Role } from "@/@types/staff";

const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name required"),
    phone: Yup.string().required("Phone required").matches(/^[0-9()\\-\s+]+$/, "Invalid phone format"),
    email: Yup.string().email("Invalid email").required("Email required"),
    username: Yup.string().required("Username required").min(3, "Username must be at least 3 characters"),
    password: Yup.string().required("Password required").min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
        .required("Confirm password required")
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    gender: Yup.string().required("Gender required"),
    roleId: Yup.string().required("Role required"),
    clinicId: Yup.string().required("Clinic required"),
});

export default function StaffRegister() {
    const [clinicList, setClinicList] = useState<ClinicByTenant[]>([]);
    const [clinicLoading, setClinicsLoading] = useState<boolean>(false);
    const [rolesList, setRolesList] = useState<Role[]>([]);
    const [rolesLoading, setRolesLoading] = useState<boolean>(false);
    const [defaultStaffRoleId, setDefaultStaffRoleId] = useState<string>("");
    const { registerStaff, status, message, isLoading, isSuccess, isError, resetStatus, isAuthenticated, tenantId } = useStaffRegistration();

    // Fetch roles and clinics when component mounts
    useEffect(() => {
        fetchRoles();
        if (isAuthenticated && tenantId) {
            fetchClinicsByTenant();
        }
    }, [isAuthenticated, tenantId]);

    const fetchRoles = async () => {
        setRolesLoading(true);
        try {
            const response = await apiGetRoles();
            if (response.data.success) {
                const roles = response.data.data;
                setRolesList(roles);
                
                // Find and set STAFF role as default
                const staffRole = roles.find(role => role.roleName === 'STAFF');
                if (staffRole) {
                    setDefaultStaffRoleId(staffRole.id);
                }
            } else {
                console.error("Failed to fetch roles:", response.data);
                setRolesList([]);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            setRolesList([]);
        } finally {
            setRolesLoading(false);
        }
    };

    const fetchClinicsByTenant = async () => {
        if (!tenantId) return;
        
        setClinicsLoading(true);
        try {
            const response = await apiGetClinicsByTenant(tenantId);
            if (response.data.success) {
                setClinicList(response.data.data.data);
            } else {
                console.error("Failed to fetch clinics:", response.data);
                setClinicList([]);
            }
        } catch (error) {
            console.error("Error fetching clinics:", error);
            setClinicList([]);
        } finally {
            setClinicsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-center mb-8">
                Staff Registration
            </h1>

            {!isAuthenticated && (
                <Alert 
                    showIcon 
                    className="mb-4" 
                    type="warning"
                >
                    Please <a href="/sign-in" className="underline text-blue-600">login</a> first to register staff.
                </Alert>
            )}

            <Formik<StaffFormData>
                initialValues={{
                    fullName: "",
                    phone: "",
                    email: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    gender: "",
                    roleId: defaultStaffRoleId, // Default to STAFF role
                    clinicId: "",
                    dateOfJoining: "",
                }}
                enableReinitialize={true} // Allow form to update when defaultStaffRoleId changes
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                    if (!isAuthenticated) {
                        alert('Please login first!');
                        return;
                    }
                    
                    setSubmitting(true);
                    resetStatus();
                    
                    const result = await registerStaff(values);
                    
                    if (result.success) {
                        resetForm();
                    }
                    
                    setSubmitting(false);
                }}
            >
                {({ errors, touched, resetForm, isSubmitting }) => (
                    <Form>
                        <FormContainer>

                            {/* Status Messages */}
                            {message && (
                                <Alert 
                                    showIcon 
                                    className="mb-4" 
                                    type={isSuccess ? "success" : "danger"}
                                >
                                    {message}
                                </Alert>
                            )}

                            {/* Disable form if not authenticated */}
                            <fieldset disabled={!isAuthenticated}>
                                {!isAuthenticated && (
                                    <div className="mb-4 p-2 bg-gray-100 rounded text-center text-gray-600">
                                        Form disabled - Please login to continue
                                    </div>
                                )}

                            {/* --------------- PERSONAL INFO SECTION ---------------- */}
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                                <FormItem
                                    label="Full Name"
                                    invalid={errors.fullName && touched.fullName}
                                    errorMessage={errors.fullName}
                                >
                                    <Field name="fullName" component={Input} placeholder="Staff Full Name" disabled={!isAuthenticated} />
                                </FormItem>

                                <FormItem
                                    label="Phone"
                                    invalid={errors.phone && touched.phone}
                                    errorMessage={errors.phone}
                                >
                                    <Field name="phone" component={Input} placeholder="Phone" disabled={!isAuthenticated} />
                                </FormItem>

                                <FormItem
                                    label="Email"
                                    invalid={errors.email && touched.email}
                                    errorMessage={errors.email}
                                >
                                    <Field name="email" component={Input} placeholder="Email" disabled={!isAuthenticated} />
                                </FormItem>

                                <FormItem
                                    label="Gender"
                                    invalid={errors.gender && touched.gender}
                                    errorMessage={errors.gender}
                                >
                                    <Field as="select" name="gender" className="border p-2 rounded w-full" disabled={!isAuthenticated}>
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </Field>
                                </FormItem>

                                <FormItem label="Date of Joining (Optional)">
                                    <Field name="dateOfJoining" type="date" component={Input} disabled={!isAuthenticated} />
                                </FormItem>

                            </div>

                            {/* --------------- CLINIC ASSIGNMENT SECTION ---------------- */}
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Clinic Assignment</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                                <FormItem
                                    label="Role"
                                    invalid={errors.roleId && touched.roleId}
                                    errorMessage={errors.roleId}
                                >
                                    <Field as="select" name="roleId" className="border p-2 rounded w-full" disabled={!isAuthenticated || rolesLoading}>
                                        <option value="">{rolesLoading ? "Loading roles..." : "Select Role"}</option>
                                        {rolesList.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.roleName}
                                                {role.roleName === 'STAFF' && ' (Default)'}
                                            </option>
                                        ))}
                                    </Field>
                                    {rolesLoading && (
                                        <div className="text-xs text-blue-500 mt-1">Loading available roles...</div>
                                    )}
                                    {defaultStaffRoleId && (
                                        <div className="text-xs text-gray-500 mt-1">STAFF role is pre-selected by default</div>
                                    )}
                                </FormItem>

                                <FormItem
                                    label="Clinic"
                                    invalid={errors.clinicId && touched.clinicId}
                                    errorMessage={errors.clinicId}
                                >
                                    <Field as="select" name="clinicId" className="border p-2 rounded w-full" disabled={!isAuthenticated || clinicLoading}>
                                        <option value="">{clinicLoading ? "Loading clinics..." : "Select Clinic"}</option>
                                        {clinicList.map((clinic) => (
                                            <option key={clinic.id} value={clinic.id}>
                                                {clinic.name} ({clinic.clinicType})
                                            </option>
                                        ))}
                                    </Field>
                                    {clinicLoading && (
                                        <div className="text-xs text-blue-500 mt-1">Fetching clinics for your organization...</div>
                                    )}
                                </FormItem>

                            </div>

                            </fieldset>

                            {/* --------------- LOGIN CREDENTIALS SECTION ---------------- */}
                            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Login Credentials</h2>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                                <FormItem
                                    label="Username"
                                    invalid={errors.username && touched.username}
                                    errorMessage={errors.username}
                                >
                                    <Field name="username" component={Input} placeholder="Username" disabled={!isAuthenticated} />
                                </FormItem>

                                <FormItem
                                    label="Password"
                                    invalid={errors.password && touched.password}
                                    errorMessage={errors.password}
                                >
                                    <Field name="password" type="password" component={Input} placeholder="Password" disabled={!isAuthenticated} />
                                </FormItem>

                                <FormItem
                                    label="Confirm Password"
                                    invalid={errors.confirmPassword && touched.confirmPassword}
                                    errorMessage={errors.confirmPassword}
                                >
                                    <Field name="confirmPassword" type="password" component={Input} placeholder="Confirm Password" disabled={!isAuthenticated} />
                                </FormItem>

                            </div>

                            {/* ---------------- BUTTONS ---------------- */}
                            <FormItem className="mt-6">
                                <Button 
                                    type="reset" 
                                    className="mr-3" 
                                    onClick={() => {
                                        resetForm();
                                        resetStatus();
                                    }}
                                    disabled={isLoading || !isAuthenticated}
                                >
                                    Reset
                                </Button>
                                <Button 
                                    variant="solid" 
                                    type="submit"
                                    loading={isLoading || isSubmitting}
                                    disabled={!isAuthenticated}
                                >
                                    {!isAuthenticated 
                                        ? 'Login Required' 
                                        : isLoading 
                                            ? 'Registering...' 
                                            : 'Register Staff'
                                    }
                                </Button>
                            </FormItem>

                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
