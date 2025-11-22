// Doctor Registration Form (Styled similar to ClinicRegister)
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import useDoctorRegistration from "@/utils/hooks/useDoctorRegistration";
import type { DoctorFormData } from "@/@types/doctor";
import { apiGetClinics, type Clinic } from "@/services/DoctorService";

// Interface for pincode API response (same as clinic registration)
interface PincodeData {
    Pincode: string;
    Town: {
        id: string;
        townNameIntlang: string;
        townNameLocalLang: string;
        townCode: string;
        subDistrictCode: string;
        type: string;
    };
    SubDistrict: {
        id: string;
        subDistrictNameIntlang: string;
        subDistrictCode: string;
        districtCode: string;
    };
    District: {
        id: string;
        districtNameIntlang: string;
        districtCode: string;
        stateCode: string;
    };
    State: {
        id: string;
        stateNameIntlang: string;
        stateNameLoclang: string;
        stateCode: string;
        isUnionTerritory: boolean;
        countryId: string;
    };
    Country: {
        id: string;
        countryName: string;
        countryDialCode: string;
        countryCodeAlpha2: string;
        countryCodeAlpha3: string;
    };
}

interface PincodeResponse {
    success: boolean;
    data: {
        status: string;
        data: PincodeData[];
    };
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name required"),
  lastName: Yup.string().required("Last name required"),
  phone: Yup.string().required("Phone required").matches(/^[0-9()\\-\s+]+$/, "Invalid phone format"),
  email: Yup.string().email("Invalid email").required("Email required"),
  username: Yup.string().required("Username required").min(3, "Username must be at least 3 characters"),
  password: Yup.string().required("Password required").min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password required")
    .oneOf([Yup.ref('password')], 'Passwords must match'),
  clinicId: Yup.string().required("Clinic required"),
  sex: Yup.string().required("Gender required"),
  pin: Yup.string().required("PIN required").length(6, "PIN must be 6 digits"),
  state: Yup.string().required("State required"),
  district: Yup.string().required("District required"),
  subDistrict: Yup.string().required("Taluka required"),
  town: Yup.string().required("Village required"),
  address: Yup.string().required("Address required"),
});

export default function DoctorRegister() {
  const [locationData, setLocationData] = useState<PincodeData[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");
  const { registerDoctor, status, message, isLoading, isSuccess, isError, resetStatus, isAuthenticated } = useDoctorRegistration();

  // Clinic state management
  const [clinicList, setClinicList] = useState<Clinic[]>([]);
  const [clinicSearch, setClinicSearch] = useState<string>("");
  const [clinicLoading, setClinicLoading] = useState<boolean>(false);
  const [showClinicDropdown, setShowClinicDropdown] = useState<boolean>(false);

  // Get unique values for dropdowns
  const getUniqueDistricts = () => {
    const districts = locationData.map(item => item.District.districtNameIntlang);
    return [...new Set(districts)];
  };

  const getUniqueSubDistricts = () => {
    const subDistricts = locationData
      .filter(item => !selectedDistrict || item.District.districtNameIntlang === selectedDistrict)
      .map(item => item.SubDistrict.subDistrictNameIntlang);
    return [...new Set(subDistricts)];
  };

  const getUniqueTowns = () => {
    const towns = locationData
      .filter(item => 
        (!selectedDistrict || item.District.districtNameIntlang === selectedDistrict) &&
        (!selectedSubDistrict || item.SubDistrict.subDistrictNameIntlang === selectedSubDistrict)
      )
      .map(item => item.Town.townNameIntlang);
    return [...new Set(towns)];
  };

  // Fetch clinics from API
  async function fetchClinics(searchTerm: string = "") {
    setClinicLoading(true);
    try {
      const response = await apiGetClinics(searchTerm);
      if (response.data.success) {
        setClinicList(response.data.data);
      } else {
        console.error("Failed to fetch clinics:", response.data);
        setClinicList([]);
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
      setClinicList([]);
    } finally {
      setClinicLoading(false);
    }
  }

  // Load clinics on component mount
  React.useEffect(() => {
    fetchClinics();
  }, []);

  // Debounced search for clinics
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchClinics(clinicSearch);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [clinicSearch]);

  async function fetchPincode(pin: string, setFieldValue: (field: string, value: any) => void) {
    if (pin.length !== 6) {
      // Reset location data if PIN is incomplete
      setLocationData([]);
      setSelectedDistrict("");
      setSelectedSubDistrict("");
      setFieldValue("state", "");
      setFieldValue("district", "");
      setFieldValue("subDistrict", "");
      setFieldValue("town", "");
      return;
    }

    try {
      const res = await fetch(
        `https://stg-shg.shauryatechnosoft.com/server/api/v1/o/pincode/${pin}`
      );
      const response: PincodeResponse = await res.json();

      if (response.success && response.data.data.length > 0) {
        const data = response.data.data;
        setLocationData(data);
        
        // Get first entry for auto-fill
        const firstEntry = data[0];
        
        // Auto-fill state (same for all entries)
        setFieldValue("state", firstEntry.State.stateNameIntlang);
        setFieldValue("stateCode", firstEntry.State.stateCode);
        setFieldValue("countryId", firstEntry.Country.id);
        setFieldValue("countryName", firstEntry.Country.countryName);
        
        // Reset selections
        setSelectedDistrict("");
        setSelectedSubDistrict("");
        setFieldValue("district", "");
        setFieldValue("subDistrict", "");
        setFieldValue("town", "");
      } else {
        // Reset if no data found
        setLocationData([]);
        setFieldValue("state", "");
        setFieldValue("district", "");
        setFieldValue("subDistrict", "");
        setFieldValue("town", "");
      }
    } catch (err) {
      console.error("Error fetching pincode:", err);
      setLocationData([]);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">Doctor Registration</h1>

      {!isAuthenticated && (
        <Alert 
          showIcon 
          className="mb-4" 
          type="warning"
        >
          Please <a href="/sign-in" className="underline text-blue-600">login</a> first to register a doctor.
        </Alert>
      )}

      <Formik<DoctorFormData>
        initialValues={{
          firstName: "",
          lastName: "",
          middleName: "",
          phone: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          clinicId: "",
          tenantId: "", // Will be set when clinic is selected
          sex: "",
          dateOfBirth: "",
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
          countryId: "", // Will be set from pincode API
          countryName: "India",
          qualifications: "",
          licenseNumber: "",
          yearsOfExperience: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (!isAuthenticated) {
            alert('Please login first!');
            return;
          }
          
          setSubmitting(true);
          resetStatus();
          
          const result = await registerDoctor(values);
          
          if (result.success) {
            resetForm();
            // Reset location data
            setLocationData([]);
            setSelectedDistrict("");
            setSelectedSubDistrict("");
          }
          
          setSubmitting(false);
        }}
      >
        {({ errors, touched, resetForm, setFieldValue, isSubmitting }) => (
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

                {/* First Name */}
                <FormItem
                  label="First Name"
                  invalid={errors.firstName && touched.firstName}
                  errorMessage={errors.firstName}
                >
                  <Field name="firstName" component={Input} placeholder="First name" />
                </FormItem>

                {/* Middle Name */}
                <FormItem label="Middle Name (Optional)">
                  <Field name="middleName" component={Input} placeholder="Middle name" />
                </FormItem>

                {/* Last Name */}
                <FormItem
                  label="Last Name"
                  invalid={errors.lastName && touched.lastName}
                  errorMessage={errors.lastName}
                >
                  <Field name="lastName" component={Input} placeholder="Last name" />
                </FormItem>

                {/* Email */}
                <FormItem
                  label="Email"
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field name="email" type="email" component={Input} placeholder="Email" />
                </FormItem>

                {/* Phone */}
                <FormItem
                  label="Phone Number"
                  invalid={errors.phone && touched.phone}
                  errorMessage={errors.phone}
                >
                  <Field name="phone" component={Input} placeholder="Phone" />
                </FormItem>

                {/* Gender */}
                <FormItem
                  label="Gender"
                  invalid={errors.sex && touched.sex}
                  errorMessage={errors.sex}
                >
                  <Field as="select" name="sex" className="border p-2 rounded w-full">
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </Field>
                </FormItem>

                {/* Date of Birth */}
                <FormItem label="Date of Birth (Optional)">
                  <Field name="dateOfBirth" type="date" component={Input} />
                </FormItem>

                {/* Clinic - Searchable Dropdown */}
                <FormItem
                  label="Clinic"
                  invalid={errors.clinicId && touched.clinicId}
                  errorMessage={errors.clinicId}
                >
                  <div className="relative">
                    <Field name="clinicId">
                      {({ field, form }: any) => (
                        <div>
                          <Input
                            placeholder={clinicLoading ? "Loading clinics..." : "Search and select clinic"}
                            value={clinicSearch}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setClinicSearch(e.target.value);
                              setShowClinicDropdown(true);
                              // Clear selected clinic if user types
                              if (field.value) {
                                form.setFieldValue('clinicId', '');
                              }
                            }}
                            onFocus={() => setShowClinicDropdown(true)}
                            disabled={clinicLoading}
                          />
                          
                          {/* Dropdown List */}
                          {showClinicDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                              {clinicLoading ? (
                                <div className="p-3 text-center text-gray-500">Loading...</div>
                              ) : clinicList.length === 0 ? (
                                <div className="p-3 text-center text-gray-500">
                                  {clinicSearch ? 'No clinics found' : 'No active clinics available'}
                                </div>
                              ) : (
                                clinicList.map((clinic) => (
                                  <div
                                    key={clinic.id}
                                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                    onClick={() => {
                                      form.setFieldValue('clinicId', clinic.id);
                                      form.setFieldValue('tenantId', clinic.tenant.id); // Set tenantId from selected clinic
                                      setClinicSearch(clinic.name);
                                      setShowClinicDropdown(false);
                                    }}
                                  >
                                    <div className="font-medium">{clinic.name}</div>
                                    <div className="text-sm text-gray-600">
                                      {clinic.address.address}, {clinic.address.town}, {clinic.address.state}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {clinic.phone} • {clinic.email}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                          
                          {/* Selected Clinic Display */}
                          {field.value && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                              <span className="text-green-700">Selected: </span>
                              {clinicList.find(c => c.id === field.value)?.name || 'Unknown Clinic'}
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                    
                    {/* Click outside to close dropdown */}
                    {showClinicDropdown && (
                      <div 
                        className="fixed inset-0 z-0" 
                        onClick={() => setShowClinicDropdown(false)}
                      />
                    )}
                  </div>
                </FormItem>

              </div>

              {/* --------------- ADDRESS SECTION ---------------- */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Address Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                  <Field 
                    as="select" 
                    name="district" 
                    className="border p-2 rounded w-full"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const districtValue = e.target.value;
                      setFieldValue("district", districtValue);
                      setSelectedDistrict(districtValue);
                      
                      // Find district data and set codes
                      const districtData = locationData.find(item => 
                        item.District.districtNameIntlang === districtValue
                      );
                      if (districtData) {
                        setFieldValue("districtCode", districtData.District.districtCode);
                      }
                      
                      // Reset sub-selections
                      setSelectedSubDistrict("");
                      setFieldValue("subDistrict", "");
                      setFieldValue("town", "");
                    }}
                  >
                    <option value="">Select District</option>
                    {getUniqueDistricts().map((district, i) => (
                      <option key={i} value={district}>{district}</option>
                    ))}
                  </Field>
                </FormItem>

                {/* Taluka/SubDistrict */}
                <FormItem
                  label="Taluka"
                  invalid={errors.subDistrict && touched.subDistrict}
                  errorMessage={errors.subDistrict}
                >
                  <Field 
                    as="select" 
                    name="subDistrict" 
                    className="border p-2 rounded w-full"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const subDistrictValue = e.target.value;
                      setFieldValue("subDistrict", subDistrictValue);
                      setSelectedSubDistrict(subDistrictValue);
                      
                      // Find sub-district data and set codes
                      const subDistrictData = locationData.find(item => 
                        item.SubDistrict.subDistrictNameIntlang === subDistrictValue &&
                        (!selectedDistrict || item.District.districtNameIntlang === selectedDistrict)
                      );
                      if (subDistrictData) {
                        setFieldValue("subDistrictCode", subDistrictData.SubDistrict.subDistrictCode);
                      }
                      
                      // Reset town selection
                      setFieldValue("town", "");
                    }}
                  >
                    <option value="">Select Taluka</option>
                    {getUniqueSubDistricts().map((subDistrict, i) => (
                      <option key={i} value={subDistrict}>{subDistrict}</option>
                    ))}
                  </Field>
                </FormItem>

                {/* Village/Town */}
                <FormItem
                  label="Village"
                  invalid={errors.town && touched.town}
                  errorMessage={errors.town}
                >
                  <Field 
                    as="select" 
                    name="town" 
                    className="border p-2 rounded w-full"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const townValue = e.target.value;
                      setFieldValue("town", townValue);
                      
                      // Find town data and set codes
                      const townData = locationData.find(item => 
                        item.Town.townNameIntlang === townValue &&
                        (!selectedDistrict || item.District.districtNameIntlang === selectedDistrict) &&
                        (!selectedSubDistrict || item.SubDistrict.subDistrictNameIntlang === selectedSubDistrict)
                      );
                      if (townData) {
                        setFieldValue("townCode", townData.Town.townCode);
                      }
                    }}
                  >
                    <option value="">Select Village</option>
                    {getUniqueTowns().map((town, i) => (
                      <option key={i} value={town}>{town}</option>
                    ))}
                  </Field>
                </FormItem>

                {/* Full Address */}
                <FormItem
                  label="Full Address"
                  invalid={errors.address && touched.address}
                  errorMessage={errors.address}
                >
                  <Field name="address" component={Input} placeholder="Full Address" />
                </FormItem>

              </div>

              {/* --------------- PROFESSIONAL INFO SECTION ---------------- */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Professional Information (Optional)</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                {/* Qualifications */}
                <FormItem label="Qualifications">
                  <Field name="qualifications" component={Input} placeholder="e.g. MBBS, BVSc" />
                </FormItem>

                {/* License Number */}
                <FormItem label="License Number">
                  <Field name="licenseNumber" component={Input} placeholder="License No." />
                </FormItem>

                {/* Experience */}
                <FormItem label="Years of Experience">
                  <Field name="yearsOfExperience" type="number" component={Input} placeholder="Years" />
                </FormItem>

              </div>

              </fieldset>

              {/* --------------- LOGIN CREDENTIALS SECTION ---------------- */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Login Credentials</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                {/* Username */}
                <FormItem
                  label="Username"
                  invalid={errors.username && touched.username}
                  errorMessage={errors.username}
                >
                  <Field name="username" component={Input} placeholder="Username" disabled={!isAuthenticated} />
                </FormItem>

                {/* Password */}
                <FormItem
                  label="Password"
                  invalid={errors.password && touched.password}
                  errorMessage={errors.password}
                >
                  <Field name="password" type="password" component={Input} placeholder="Password" disabled={!isAuthenticated} />
                </FormItem>

                {/* Confirm Password */}
                <FormItem
                  label="Confirm Password"
                  invalid={errors.confirmPassword && touched.confirmPassword}
                  errorMessage={errors.confirmPassword}
                >
                  <Field name="confirmPassword" type="password" component={Input} placeholder="Confirm Password" disabled={!isAuthenticated} />
                </FormItem>

              </div>

              {/* --------------- BUTTONS ---------------- */}
              <FormItem className="mt-6">
                <Button 
                  type="reset" 
                  className="mr-3" 
                  onClick={() => {
                    resetForm();
                    setLocationData([]);
                    setSelectedDistrict("");
                    setSelectedSubDistrict("");
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
                      : 'Register Doctor'
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
