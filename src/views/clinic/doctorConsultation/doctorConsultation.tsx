import React, { useState } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";

import { FormContainer, FormItem } from "@/components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const validationSchema = Yup.object().shape({
  patientId: Yup.string().required("Patient required"),
  visitType: Yup.string().required("Visit type required"),
  symptoms: Yup.string().required("Symptoms required"),
});

export default function DoctorConsultationForm() {
  const [patientList] = useState([
    { id: "p1", name: "Rohan Sharma (P001)" },
    { id: "p2", name: "Rekha Patel (P002)" },
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        Doctor Consultation
      </h1>

      <Formik
        initialValues={{
          patientId: "",
          visitType: "CLINIC",
          symptoms: "",
          temperature: "",
          pulse: "",
          spo2: "",
          systolic: "",
          diastolic: "",

          diagnoses: [{ icdCode: "", label: "" }],
          prescriptions: [{ medicine: "", dose: "", days: "", notes: "" }],
          labOrders: [{ testName: "", notes: "", reports: [] }],

          patientImage: null,
          notes: "",
          nextVisitAt: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          alert("Saved Successfully!");
          console.log(values);
          resetForm();
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <FormContainer>

              {/* ---------------- Patient / Visit / Symptoms ---------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                <FormItem label="Select Patient">
                  <Field
                    as="select"
                    name="patientId"
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Patient</option>
                    {patientList.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Field>
                </FormItem>

                <FormItem label="Visit Type">
                  <Field
                    as="select"
                    name="visitType"
                    className="border p-2 rounded w-full"
                  >
                    <option value="CLINIC">Clinic</option>
                    <option value="HOME">Home</option>
                    <option value="ON_CALL">On Call</option>
                    <option value="FARM">Farm</option>
                  </Field>
                </FormItem>

                <FormItem label="Symptoms">
                  <Field name="symptoms" component={Input} placeholder="Enter symptoms" />
                </FormItem>

                <FormItem label="Upload Patient Image (Optional)">
                  <input
                    type="file"
                    accept="image/*"
                    className="border p-2 rounded w-full"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue("patientImage", file);
                    }}
                  />
                </FormItem>
              </div>

              {/* IMAGE PREVIEW */}
              {values.patientImage && (
                <div className="mt-3">
                  <h3 className="font-semibold">Patient Image Preview</h3>
                  <img
                    src={URL.createObjectURL(values.patientImage)}
                    className="w-40 h-40 border rounded object-cover mt-2"
                  />
                </div>
              )}

              {/* ---------------- VITALS ---------------- */}
              <h2 className="text-lg font-semibold mt-6">Vitals (Optional)</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                <FormItem label="Temperature (°C)">
                  <Field name="temperature" component={Input} />
                </FormItem>

                <FormItem label="Pulse (bpm)">
                  <Field name="pulse" component={Input} />
                </FormItem>

                <FormItem label="SpO₂ (%)">
                  <Field name="spo2" component={Input} />
                </FormItem>

                <FormItem label="Systolic BP">
                  <Field name="systolic" component={Input} />
                </FormItem>

                <FormItem label="Diastolic BP">
                  <Field name="diastolic" component={Input} />
                </FormItem>

                <FormItem label="Notes (Optional)">
                  <Field name="notes" component={Input} placeholder="Notes" />
                </FormItem>

              </div>

              {/* ---------------- DIAGNOSIS ---------------- */}
              <h2 className="text-lg font-semibold mt-6">Diagnosis</h2>

              <FieldArray name="diagnoses">
                {({ push, remove }) => (
                  <>
                    {values.diagnoses.map((_, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                        <FormItem label="ICD Code (Optional)">
                          <Field
                            name={`diagnoses.${i}.icdCode`}
                            component={Input}
                            placeholder="ICD Code"
                          />
                        </FormItem>

                        <FormItem label="Diagnosis">
                          <Field
                            name={`diagnoses.${i}.label`}
                            component={Input}
                            placeholder="Diagnosis"
                          />
                        </FormItem>

                        <FormItem label="">
                          <Button
                            type="button"
                            className="bg-red-500 text-white mt-6"
                            onClick={() => remove(i)}
                          >
                            Remove
                          </Button>
                        </FormItem>
                      </div>
                    ))}

                    <Button
                      type="button"
                      className="mt-2"
                      onClick={() => push({ icdCode: "", label: "" })}
                    >
                      Add Diagnosis
                    </Button>
                  </>
                )}
              </FieldArray>

              {/* ---------------- PRESCRIPTIONS ---------------- */}
              <h2 className="text-lg font-semibold mt-6">Prescription</h2>

              <FieldArray name="prescriptions">
                {({ push, remove }) => (
                  <>
                    {values.prescriptions.map((_, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">

                        <FormItem label="Medicine">
                          <Field
                            name={`prescriptions.${i}.medicine`}
                            component={Input}
                            placeholder="Medicine"
                          />
                        </FormItem>

                        <FormItem label="Dosage">
                          <Field
                            name={`prescriptions.${i}.dose`}
                            component={Input}
                            placeholder="Dose"
                          />
                        </FormItem>

                        <FormItem label="Days">
                          <Field
                            name={`prescriptions.${i}.days`}
                            component={Input}
                            placeholder="Days"
                          />
                        </FormItem>

                        <FormItem label="Notes (Optional)">
                          <Field
                            name={`prescriptions.${i}.notes`}
                            component={Input}
                            placeholder="Instructions"
                          />
                        </FormItem>

                        <FormItem>
                          <Button
                            type="button"
                            className="bg-red-500 text-white mt-6"
                            onClick={() => remove(i)}
                          >
                            Remove
                          </Button>
                        </FormItem>

                      </div>
                    ))}

                    <Button
                      type="button"
                      className="mt-2"
                      onClick={() =>
                        push({ medicine: "", dose: "", days: "", notes: "" })
                      }
                    >
                      Add Prescription
                    </Button>
                  </>
                )}
              </FieldArray>

              {/* ---------------- LAB ORDERS ---------------- */}
              <h2 className="text-lg font-semibold mt-6">Lab Orders (Optional)</h2>

              <FieldArray name="labOrders">
                {({ push, remove }) => (
                  <>
                    {values.labOrders.map((_, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">

                        <FormItem label="Test Name">
                          <Field
                            name={`labOrders.${i}.testName`}
                            component={Input}
                            placeholder="Test"
                          />
                        </FormItem>

                        <FormItem label="Notes (Optional)">
                          <Field
                            name={`labOrders.${i}.notes`}
                            component={Input}
                            placeholder="Notes"
                          />
                        </FormItem>

                        <FormItem label="Upload Report (Optional)">
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            multiple
                            className="border p-2 rounded w-full"
                            onChange={(e) =>
                              setFieldValue(
                                `labOrders.${i}.reports`,
                                [...e.target.files]
                              )
                            }
                          />
                        </FormItem>

                        <FormItem>
                          <Button
                            type="button"
                            className="bg-red-500 text-white mt-6"
                            onClick={() => remove(i)}
                          >
                            Remove
                          </Button>
                        </FormItem>
                      </div>
                    ))}

                    <Button
                      type="button"
                      className="mt-2"
                      onClick={() =>
                        push({ testName: "", notes: "", reports: [] })
                      }
                    >
                      Add Lab Test
                    </Button>
                  </>
                )}
              </FieldArray>

              {/* ---------------- SUBMIT ---------------- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

                <FormItem label="Next Visit (Optional)">
                  <Field
                    name="nextVisitAt"
                    type="datetime-local"
                    component={Input}
                  />
                </FormItem>

                <FormItem>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 text-white h-12"
                  >
                    Save Consultation
                  </Button>
                </FormItem>

              </div>

            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
}
