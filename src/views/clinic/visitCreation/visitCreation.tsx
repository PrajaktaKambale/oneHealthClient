import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import useConsultation from "@/utils/hooks/useConsultation";
import { apiGetPatients, apiGetDoctorsByClinic } from "@/services/ConsultationService";
import type { ConsultationFormData, PatientData, DoctorData } from "@/@types/consultation";

const validationSchema = Yup.object().shape({
  patientId: Yup.string().required("Patient required"),
  doctorId: Yup.string().required("Doctor required"),
  visitType: Yup.string().required("Visit type required"),
  symptoms: Yup.string().required("Symptoms required"),
});

export default function VisitCreationForm() {
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState<PatientData[]>([]);
  const [doctorList, setDoctorList] = useState<DoctorData[]>([]);
  const [patientsLoading, setPatientsLoading] = useState<boolean>(false);
  const [doctorsLoading, setDoctorsLoading] = useState<boolean>(false);
  
  const { createConsultation, status, message, isLoading, isSuccess, isError, resetStatus, isAuthenticated, clinicId, currentUser, isDoctor } = useConsultation();

  // Fetch patients and doctors when component mounts
  useEffect(() => {
    if (isAuthenticated && clinicId) {
      fetchPatients();
      fetchDoctors();
    }
  }, [isAuthenticated, clinicId]);

  const fetchPatients = async () => {
    if (!clinicId) {
      console.error('No clinic ID available');
      return;
    }
    
    try {
      setPatientsLoading(true);
      console.log('Fetching patients for clinic:', clinicId);
      
      const response = await apiGetPatients(clinicId);
      console.log('Patients API response:', response);
      
      if (response?.data?.success && Array.isArray(response.data.data)) {
        setPatientList(response.data.data);
      } else {
        console.error('Invalid patients response format:', response);
        setPatientList([]);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatientList([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    if (!clinicId) {
      console.error('No clinic ID available');
      return;
    }
    
    try {
      setDoctorsLoading(true);
      console.log('Fetching doctors for clinic:', clinicId);
      
      const response = await apiGetDoctorsByClinic(clinicId);
      console.log('Doctors API response:', response);
      
      if (response?.data?.success && Array.isArray(response.data.data)) {
        setDoctorList(response.data.data);
      } else {
        console.error('Invalid doctors response format:', response);
        setDoctorList([]);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctorList([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  // Get default doctor ID if current user is doctor
  const getDefaultDoctorId = () => {
    if (isDoctor && currentUser.id) {
      const currentDoctor = doctorList.find(doctor => doctor.user.id === currentUser.id);
      return currentDoctor?.user.id || '';
    }
    return '';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        Create New Visit
      </h1>

      {!isAuthenticated && (
        <Alert 
          showIcon 
          className="mb-4" 
          type="warning"
        >
          Please <a href="/sign-in" className="underline text-blue-600">login</a> first to create a visit.
        </Alert>
      )}

      <Formik<ConsultationFormData>
        initialValues={{
          patientId: "",
          doctorId: getDefaultDoctorId(),
          visitType: "CLINIC",
          symptoms: "",
          notes: "",
          temperature: "",
          pulse: "",
          systolic: "",
          diastolic: "",
          spo2: "",
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (!isAuthenticated) {
            alert('Please login first!');
            return;
          }
          
          setSubmitting(true);
          resetStatus();
          
          const result = await createConsultation(values);
          
          console.log('Create visit result:', result);
          
          if (result.success) {
            resetForm();
            // Force navigation immediately for testing
            navigate('/clinic/visits');
          } else {
            console.error('Visit creation failed:', result);
          }
          
          setSubmitting(false);
        }}
      >
        {({ values, setFieldValue, errors, touched, resetForm, isSubmitting }) => (
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
                
                {/* --------------- BASIC VISIT INFO ---------------- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Visit Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Patient Selection */}
                    <FormItem 
                      label="Patient"
                      invalid={errors.patientId && touched.patientId}
                      errorMessage={errors.patientId}
                    >
                      <Field name="patientId">
                        {({ field }: any) => (
                          <select 
                            {...field}
                            className="w-full border rounded p-2"
                            disabled={!isAuthenticated}
                          >
                            <option value="">{patientsLoading ? "Loading patients..." : "Select Patient"}</option>
                            {patientList.map((patient) => (
                              <option key={patient.id} value={patient.id}>
                                {patient.identities?.person?.fullName || 'Unnamed Patient'} ({patient.pseudonymId || patient.id})
                              </option>
                            ))}
                          </select>
                        )}
                      </Field>
                    </FormItem>

                    {/* Doctor Selection */}
                    <FormItem 
                      label="Doctor"
                      invalid={errors.doctorId && touched.doctorId}
                      errorMessage={errors.doctorId}
                    >
                      <Field name="doctorId">
                        {({ field }: any) => (
                          <select 
                            {...field}
                            className="w-full border rounded p-2"
                            disabled={!isAuthenticated}
                          >
                            <option value="">{doctorsLoading ? "Loading doctors..." : "Select Doctor"}</option>
                            {doctorList.map((doctor) => (
                              <option key={doctor.user.id} value={doctor.user.id}>
                                Dr. {doctor.person?.metadata?.firstName || 'Unknown'} {doctor.person?.metadata?.lastName || ''}
                                {isDoctor && currentUser.id === doctor.user.id && ' (You)'}
                              </option>
                            ))}
                          </select>
                        )}
                      </Field>
                    </FormItem>

                    {/* Visit Type */}
                    <FormItem 
                      label="Visit Type"
                      invalid={errors.visitType && touched.visitType}
                      errorMessage={errors.visitType}
                    >
                      <Field name="visitType">
                        {({ field }: any) => (
                          <select 
                            {...field}
                            className="w-full border rounded p-2"
                            disabled={!isAuthenticated}
                          >
                            <option value="CLINIC">Clinic Visit</option>
                            <option value="HOME">Home Visit</option>
                            <option value="ON_CALL">On Call</option>
                            <option value="FARM">Farm Visit</option>
                          </select>
                        )}
                      </Field>
                    </FormItem>
                  </div>
                </div>

                {/* --------------- SYMPTOMS & NOTES SECTION ---------------- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Symptoms & Notes</h2>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <FormItem 
                      label="Symptoms"
                      invalid={errors.symptoms && touched.symptoms}
                      errorMessage={errors.symptoms}
                    >
                      <Field 
                        name="symptoms" 
                        component="textarea"
                        rows="3"
                        placeholder="Enter symptoms separated by commas (e.g., Fever, Headache, Cough)" 
                        className="w-full border rounded p-2"
                        disabled={!isAuthenticated}
                      />
                    </FormItem>

                    <FormItem label="Additional Notes">
                      <Field 
                        name="notes" 
                        component="textarea"
                        rows="2"
                        placeholder="Any additional notes..."
                        className="w-full border rounded p-2"
                        disabled={!isAuthenticated}
                      />
                    </FormItem>
                  </div>
                </div>

                {/* --------------- VITALS SECTION ---------------- */}
                <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Vitals</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    
                    <FormItem label="Temperature (°F)">
                      <Field 
                        name="temperature" 
                        type="number" 
                        component={Input} 
                        placeholder="98.6" 
                        disabled={!isAuthenticated}
                      />
                    </FormItem>

                    <FormItem label="Pulse (bpm)">
                      <Field 
                        name="pulse" 
                        type="number" 
                        component={Input} 
                        placeholder="72" 
                        disabled={!isAuthenticated}
                      />
                    </FormItem>

                    <FormItem label="SpO2 (%)">
                      <Field 
                        name="spo2" 
                        type="number" 
                        component={Input} 
                        placeholder="98" 
                        disabled={!isAuthenticated}
                      />
                    </FormItem>

                    <FormItem label="Systolic BP">
                      <Field 
                        name="systolic" 
                        type="number" 
                        component={Input} 
                        placeholder="120" 
                        disabled={!isAuthenticated}
                      />
                    </FormItem>

                    <FormItem label="Diastolic BP">
                      <Field 
                        name="diastolic" 
                        type="number" 
                        component={Input} 
                        placeholder="80" 
                        disabled={!isAuthenticated}
                      />
                    </FormItem>
                  </div>
                </div>

              </fieldset>

              {/* --------------- BUTTONS ---------------- */}
              <FormItem className="mt-6">
                <Button 
                  type="button" 
                  className="mr-3" 
                  onClick={() => {
                    console.log('Navigating to visit list...');
                    navigate('/clinic/visits');
                  }}
                  disabled={isLoading || !isAuthenticated}
                >
                  Go to Visit List (Test)
                </Button>
                <Button 
                  type="button" 
                  className="mr-3" 
                  onClick={() => navigate('/clinic/visits')}
                  disabled={isLoading || !isAuthenticated}
                >
                  Back to Visits
                </Button>
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
                  className="bg-green-600 text-white"
                >
                  {!isAuthenticated 
                    ? 'Login Required' 
                    : isLoading 
                      ? 'Creating...' 
                      : 'Create Visit'
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