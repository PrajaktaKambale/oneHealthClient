import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

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

export default function DoctorConsultationForm() {
  const [patientList, setPatientList] = useState<PatientData[]>([]);
  const [doctorList, setDoctorList] = useState<DoctorData[]>([]);
  const [patientsLoading, setPatientsLoading] = useState<boolean>(false);
  const [doctorsLoading, setDoctorsLoading] = useState<boolean>(false);
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState<'consultation' | 'diagnosis'>('consultation');
  const [createdVisitId, setCreatedVisitId] = useState<string | null>(null);
  const [visitData, setVisitData] = useState<any>(null);
  
  const { createConsultation, status, message, isLoading, isSuccess, isError, resetStatus, isAuthenticated, clinicId, currentUser, isDoctor } = useConsultation();

  // Fetch patients and doctors when component mounts
  useEffect(() => {
    if (isAuthenticated && clinicId) {
      fetchPatients();
      fetchDoctors();
    }
  }, [isAuthenticated, clinicId]);

  const fetchPatients = async () => {
    if (!clinicId) return;
    
    setPatientsLoading(true);
    try {
      const response = await apiGetPatients(clinicId);
      console.log('Patients API response:', response.data);
      
      if (response.data.success) {
        const patients = response.data.data || [];
        console.log('Patients data:', patients);
        setPatientList(patients);
      } else {
        console.error("Failed to fetch patients:", response.data);
        setPatientList([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatientList([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    if (!clinicId) return;
    
    setDoctorsLoading(true);
    try {
      const response = await apiGetDoctorsByClinic(clinicId);
      console.log('Doctors API response:', response.data);
      
      if (response.data.success) {
        const doctors = response.data.data || [];
        console.log('Doctors data:', doctors);
        setDoctorList(doctors);
      } else {
        console.error("Failed to fetch doctors:", response.data);
        setDoctorList([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
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
        Doctor Consultation
      </h1>

      {/* Step Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep === 'consultation' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
          }`}>
            1
          </div>
          <span className="mx-2 text-sm">Basic Info & Vitals</span>
          <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            currentStep === 'diagnosis' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'
          }`}>
            2
          </div>
          <span className="mx-2 text-sm">Diagnosis & Prescription</span>
        </div>
      </div>

      {currentStep === 'consultation' && (
        <div>
          {!isAuthenticated && (
            <Alert 
              showIcon 
              className="mb-4" 
              type="warning"
            >
              Please <a href="/sign-in" className="underline text-blue-600">login</a> first to create consultation.
            </Alert>
          )}

      <Formik<ConsultationFormData>
        initialValues={{
          patientId: "",
          doctorId: getDefaultDoctorId(), // Auto-select if user is doctor
          visitType: "CLINIC",
          symptoms: "",
          notes: "",
          temperature: "",
          pulse: "",
          systolic: "",
          diastolic: "",
          spo2: "",
        }}
        enableReinitialize={true} // Allow form to update when doctors list loads
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (!isAuthenticated) {
            alert('Please login first!');
            return;
          }
          
          setSubmitting(true);
          resetStatus();
          
          const result = await createConsultation(values);
          
          if (result.success && result.data) {
            // Store the created visit data and move to next step
            setCreatedVisitId(result.data.id);
            setVisitData(result.data);
            setCurrentStep('diagnosis');
            resetForm();
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
                {!isAuthenticated && (
                  <div className="mb-4 p-2 bg-gray-100 rounded text-center text-gray-600">
                    Form disabled - Please login to continue
                  </div>
                )}

              {/* --------------- CONSULTATION INFO SECTION ---------------- */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Consultation Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                {/* Patient Selection */}
                <FormItem 
                  label="Select Patient"
                  invalid={errors.patientId && touched.patientId}
                  errorMessage={errors.patientId}
                >
                  <Field
                    as="select"
                    name="patientId"
                    className="border p-2 rounded w-full"
                    disabled={!isAuthenticated || patientsLoading}
                  >
                    <option value="">{patientsLoading ? "Loading patients..." : "Select Patient"}</option>
                    {patientList.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.identities?.person?.fullName || 'Unnamed Patient'} ({patient.pseudonymId || patient.id})
                      </option>
                    ))}
                  </Field>
                  {patientsLoading && (
                    <div className="text-xs text-blue-500 mt-1">Loading patients...</div>
                  )}
                </FormItem>

                {/* Doctor Selection */}
                <FormItem 
                  label="Select Doctor"
                  invalid={errors.doctorId && touched.doctorId}
                  errorMessage={errors.doctorId}
                >
                  <Field
                    as="select"
                    name="doctorId"
                    className="border p-2 rounded w-full"
                    disabled={!isAuthenticated || doctorsLoading}
                  >
                    <option value="">{doctorsLoading ? "Loading doctors..." : "Select Doctor"}</option>
                    {doctorList.map((doctor) => (
                      <option key={doctor.user.id} value={doctor.user.id}>
                        Dr. {doctor.person?.metadata?.firstName || 'Unknown'} {doctor.person?.metadata?.lastName || ''}
                        {isDoctor && currentUser.id === doctor.user.id && ' (You)'}
                      </option>
                    ))}
                  </Field>
                  {doctorsLoading && (
                    <div className="text-xs text-blue-500 mt-1">Loading doctors...</div>
                  )}
                  {isDoctor && (
                    <div className="text-xs text-gray-500 mt-1">Your account is pre-selected</div>
                  )}
                </FormItem>

                {/* Visit Type */}
                <FormItem 
                  label="Visit Type"
                  invalid={errors.visitType && touched.visitType}
                  errorMessage={errors.visitType}
                >
                  <Field
                    as="select"
                    name="visitType"
                    className="border p-2 rounded w-full"
                    disabled={!isAuthenticated}
                  >
                    <option value="CLINIC">Clinic</option>
                    <option value="HOME">Home</option>
                    <option value="ON_CALL">On Call</option>
                    <option value="FARM">Farm</option>
                  </Field>
                </FormItem>

              </div>

              {/* --------------- SYMPTOMS & NOTES SECTION ---------------- */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Symptoms & Notes</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                <FormItem 
                  label="Symptoms"
                  invalid={errors.symptoms && touched.symptoms}
                  errorMessage={errors.symptoms}
                >
                  <Field 
                    name="symptoms" 
                    as="textarea" 
                    rows="3"
                    className="border p-2 rounded w-full" 
                    placeholder="Enter symptoms separated by commas (e.g., Fever, Headache, Cough)" 
                    disabled={!isAuthenticated}
                  />
                  <div className="text-xs text-gray-500 mt-1">Example: Fever, headache, fatigue</div>
                </FormItem>

                <FormItem label="Notes (Optional)">
                  <Field 
                    name="notes" 
                    as="textarea" 
                    rows="3"
                    className="border p-2 rounded w-full" 
                    placeholder="Additional notes" 
                    disabled={!isAuthenticated}
                  />
                </FormItem>

              </div>

              {/* --------------- VITALS SECTION ---------------- */}
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Vitals (Optional)</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                <FormItem label="Temperature (°C)">
                  <Field 
                    name="temperature" 
                    type="number" 
                    step="0.1" 
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

                <FormItem label="SpO₂ (%)">
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

              </fieldset>

              {/* --------------- BUTTONS ---------------- */}
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
                  className="bg-green-600 text-white"
                >
                  {!isAuthenticated 
                    ? 'Login Required' 
                    : isLoading 
                      ? 'Saving...' 
                      : 'Save Consultation (Part 1)'
                  }
                </Button>
              </FormItem>

            </FormContainer>
          </Form>
        )}
      </Formik>
        </div>
      )}

      {/* Part 2: Diagnosis & Prescription */}
      {currentStep === 'diagnosis' && visitData && (
        <div>
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Consultation Created Successfully!</h3>
            <p className="text-sm text-green-700">
              Visit ID: {createdVisitId} | Patient: {visitData.patientId} | Doctor: {visitData.doctorId}
            </p>
          </div>

          <Formik
            initialValues={{
              diagnosis: '',
              prescription: '',
              labOrders: '',
              followUpDate: '',
              instructions: ''
            }}
            validationSchema={Yup.object().shape({
              diagnosis: Yup.string().required("Diagnosis required"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              // TODO: Implement Part 2 submission
              console.log('Part 2 submission:', { visitId: createdVisitId, ...values });
              alert('Part 2 functionality will be implemented next!');
              setSubmitting(false);
            }}
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form>
                <FormContainer>
                  
                  {/* Diagnosis Section */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Diagnosis</h2>
                    
                    <FormItem 
                      label="Primary Diagnosis"
                      invalid={errors.diagnosis && touched.diagnosis}
                      errorMessage={errors.diagnosis}
                    >
                      <Field 
                        name="diagnosis" 
                        component="textarea"
                        rows="3"
                        placeholder="Enter primary diagnosis..."
                        className="w-full border rounded p-2"
                      />
                    </FormItem>
                  </div>

                  {/* Prescription Section */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Prescription</h2>
                    
                    <FormItem label="Medications & Dosage">
                      <Field 
                        name="prescription" 
                        component="textarea"
                        rows="4"
                        placeholder="Enter medications, dosage, and instructions..."
                        className="w-full border rounded p-2"
                      />
                    </FormItem>
                  </div>

                  {/* Lab Orders Section */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Lab Orders</h2>
                    
                    <FormItem label="Laboratory Tests">
                      <Field 
                        name="labOrders" 
                        component="textarea"
                        rows="3"
                        placeholder="Enter required lab tests..."
                        className="w-full border rounded p-2"
                      />
                    </FormItem>
                  </div>

                  {/* Follow-up Section */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Follow-up & Instructions</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormItem label="Follow-up Date">
                        <Field 
                          name="followUpDate" 
                          type="date" 
                          component={Input}
                        />
                      </FormItem>

                      <FormItem label="Special Instructions">
                        <Field 
                          name="instructions" 
                          component="textarea"
                          rows="2"
                          placeholder="Special instructions for patient..."
                          className="w-full border rounded p-2"
                        />
                      </FormItem>
                    </div>
                  </div>

                  {/* Buttons */}
                  <FormItem className="mt-6">
                    <Button 
                      type="button" 
                      className="mr-3" 
                      onClick={() => {
                        setCurrentStep('consultation');
                        setCreatedVisitId(null);
                        setVisitData(null);
                      }}
                    >
                      Back to Step 1
                    </Button>
                    <Button 
                      variant="solid" 
                      type="submit"
                      loading={isSubmitting}
                      className="bg-blue-600 text-white"
                    >
                      Complete Consultation
                    </Button>
                  </FormItem>

                </FormContainer>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}
