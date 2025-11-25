import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import usePatientRegistration from "@/utils/hooks/usePatientRegistration";
import type { PatientFormData } from "@/@types/patient";

// Interface for pincode API response
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
  fullName: Yup.string().required("Full Name required"),
  phone: Yup.string().required("Phone required").matches(/^[0-9()\\-\s+]+$/, "Invalid phone format"),
  email: Yup.string().email("Invalid email"), // optional
  gender: Yup.string().required("Gender required"),
  dateOfBirth: Yup.string().required("DOB required"),
  pin: Yup.string().required("PIN required").length(6, "PIN must be 6 digits"),
  state: Yup.string().required("State required"),
  district: Yup.string().required("District required"),
  subDistrict: Yup.string().required("Taluka required"),
  town: Yup.string().required("Village required"),
  address: Yup.string().required("Address required"),
  // Conditional validation for animal fields will be handled in form
});

export default function PatientRegister() {
  const [locationData, setLocationData] = useState<PincodeData[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<string>("");
  const { registerPatient, status, message, isLoading, isSuccess, isError, resetStatus, isAuthenticated, clinicType } = usePatientRegistration();

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
      <h1 className="text-3xl font-bold text-center mb-8">Patient Registration</h1>
      
      {!isAuthenticated && (
        <Alert 
          showIcon 
          className="mb-4" 
          type="warning"
        >
          Please <a href="/sign-in" className="underline text-blue-600">login</a> first to register a patient.
        </Alert>
      )}

      <Formik<PatientFormData>
        initialValues={{
          fullName: "",
          phone: "",
          email: "",
          gender: "",
          dateOfBirth: "",
          age: "",
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
          countryId: "",
          countryName: "India",
          // Animal fields
          species: "",
          breed: "",
          externalId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (!isAuthenticated) {
            alert('Please login first!');
            return;
          }
          
          setSubmitting(true);
          resetStatus();
          
          const result = await registerPatient(values);
          
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
        {({ errors, touched, setFieldValue, resetForm, isSubmitting }) => (
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

              {/* Display clinic type */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <span className="font-medium text-blue-800">Clinic Type: {clinicType}</span>
                {clinicType !== 'HUMAN' && (
                  <div className="text-sm text-blue-600 mt-1">
                    Additional fields for animal information will be shown below
                  </div>
                )}
              </div>

              {/* --------------- PERSONAL INFO SECTION ---------------- */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                <FormItem
                  label="Full Name"
                  invalid={errors.fullName && touched.fullName}
                  errorMessage={errors.fullName}
                >
                  <Field name="fullName" component={Input} placeholder="Patient Name" disabled={!isAuthenticated} />
                </FormItem>

                <FormItem
                  label="Phone"
                  invalid={errors.phone && touched.phone}
                  errorMessage={errors.phone}
                >
                  <Field name="phone" component={Input} placeholder="Phone Number" disabled={!isAuthenticated} />
                </FormItem>

                <FormItem label="Email (Optional)">
                  <Field name="email" component={Input} placeholder="Email" disabled={!isAuthenticated} />
                </FormItem>

                <FormItem
                  label="Date of Birth"
                  invalid={errors.dateOfBirth && touched.dateOfBirth}
                  errorMessage={errors.dateOfBirth}
                >
                  <Field name="dateOfBirth" type="date" component={Input} disabled={!isAuthenticated} />
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

              </div>

              {/* --------------- ANIMAL INFO SECTION (Conditional) ---------------- */}
              {clinicType !== 'HUMAN' && (
                <>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Animal Information</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                    <FormItem label="Species" invalid={clinicType !== 'HUMAN' && errors.species && touched.species} errorMessage={errors.species}>
                      <Field as="select" name="species" className="border p-2 rounded w-full" disabled={!isAuthenticated}>
                        <option value="">Select Species</option>
                        <option value="DOG">Dog</option>
                        <option value="CAT">Cat</option>
                        <option value="COW">Cow</option>
                        <option value="BUFFALO">Buffalo</option>
                        <option value="GOAT">Goat</option>
                        <option value="SHEEP">Sheep</option>
                        <option value="HORSE">Horse</option>
                        <option value="OTHER">Other</option>
                      </Field>
                    </FormItem>

                    <FormItem label="Breed (Optional)">
                      <Field name="breed" component={Input} placeholder="Breed" disabled={!isAuthenticated} />
                    </FormItem>

                    <FormItem label="External ID (Optional)">
                      <Field name="externalId" component={Input} placeholder="External ID" disabled={!isAuthenticated} />
                    </FormItem>

                  </div>
                </>
              )}

              {/* --------------- ADDRESS SECTION ---------------- */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Address Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

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
                    disabled={!isAuthenticated}
                  />
                </FormItem>

                <FormItem
                  label="State"
                  invalid={errors.state && touched.state}
                  errorMessage={errors.state}
                >
                  <Field name="state" component={Input} readOnly className="bg-gray-100" disabled={!isAuthenticated} />
                </FormItem>

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
                    disabled={!isAuthenticated}
                  >
                    <option value="">Select District</option>
                    {getUniqueDistricts().map((district, i) => (
                      <option key={i} value={district}>{district}</option>
                    ))}
                  </Field>
                </FormItem>

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
                    disabled={!isAuthenticated}
                  >
                    <option value="">Select Taluka</option>
                    {getUniqueSubDistricts().map((subDistrict, i) => (
                      <option key={i} value={subDistrict}>{subDistrict}</option>
                    ))}
                  </Field>
                </FormItem>

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
                    disabled={!isAuthenticated}
                  >
                    <option value="">Select Village</option>
                    {getUniqueTowns().map((town, i) => (
                      <option key={i} value={town}>{town}</option>
                    ))}
                  </Field>
                </FormItem>

                <FormItem
                  label="Full Address"
                  invalid={errors.address && touched.address}
                  errorMessage={errors.address}
                >
                  <Field name="address" component={Input} placeholder="Full Address" disabled={!isAuthenticated} />
                </FormItem>

              </div>

              </fieldset>

              {/* ------------ BUTTONS ------------ */}
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
                      : 'Register Patient'
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
