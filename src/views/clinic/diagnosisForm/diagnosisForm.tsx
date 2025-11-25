import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button, Alert, FormItem, FormContainer, Input } from '@/components/ui';
import { useAppSelector } from '@/store';
import { apiGetVisitDetails, apiSearchIcdCodes, apiSubmitDiagnosis, apiSearchDiseaseMaster, apiSearchMedicines } from '@/services/ConsultationService';

interface ICDCode {
  value: string;
  label: string;
  snomedId: string;
  icdCode: string;
  diseaseType: string;
  isPrimary?: boolean;
}

interface Medicine {
  id: string;
  sub_category: string;
  product_name: string;
  salt_composition: string;
  product_price: string;
  product_manufactured: string;
  medicine_desc: string;
  side_effects: string;
  drug_interactions: string;
}

interface PrescriptionItem {
  medicine: Medicine;
  dose: string;
  frequency: string;
  duration: string;
}

interface VisitDetails {
  id: string;
  patientId: string;
  doctorId: string;
  visitType: string;
  symptoms: string;
  vitals: {
    temperature?: number;
    pulse?: number;
    bp?: string;
    spo2?: number;
  };
  notes?: string;
  workflowState: string;
  patient: {
    pseudonymId: string;
    type: string;
    age: number;
    sex: string;
    person?: {
      fullName: string;
    };
  };
  doctor: {
    person: {
      fullName: string;
    };
  };
}

const validationSchema = Yup.object().shape({
  prescription: Yup.string(),
  labOrders: Yup.string(),
  followUpDate: Yup.string(),
  instructions: Yup.string(),
});

interface DiagnosisFormData {
  prescription: string;
  labOrders: string;
  followUpDate: string;
  instructions: string;
}

export default function DiagnosisForm() {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  
  const [visitDetails, setVisitDetails] = useState<VisitDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');
  
  // ICD codes state
  const [icdCodes, setIcdCodes] = useState<ICDCode[]>([]);
  const [icdLoading, setIcdLoading] = useState<boolean>(false);
  const [icdSearchTerm, setIcdSearchTerm] = useState<string>('');
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<ICDCode[]>([]);
  const [showIcdDropdown, setShowIcdDropdown] = useState<boolean>(false);
  const [clinicType, setClinicType] = useState<string>('HUMAN'); // Default to human
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Medicine search state
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [allMedicines, setAllMedicines] = useState<Medicine[]>([]);
  const [medicineLoading, setMedicineLoading] = useState<boolean>(false);
  const [medicineSearchTerm, setMedicineSearchTerm] = useState<string>('');
  const [showMedicineDropdown, setShowMedicineDropdown] = useState<boolean>(false);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [currentDose, setCurrentDose] = useState<string>('');
  const [currentFrequency, setCurrentFrequency] = useState<string>('');
  const [currentDuration, setCurrentDuration] = useState<string>('');
  const medicineDropdownRef = useRef<HTMLDivElement>(null);
  
  // Get auth state from Redux
  const { signedIn, accessToken } = useAppSelector((state) => state.auth.session);
  const user = useAppSelector((state) => state.auth.user);

  const fetchAllMedicines = async () => {
    try {
      setMedicineLoading(true);
      console.log('Fetching all medicines from API...');
      
      const response = await apiSearchMedicines();
      console.log('Medicine master API response:', response);
      
      // Try to extract items from response
      const responseData = response?.data as any;
      let allMedicinesData = responseData?.data || responseData || [];
      
      // If response is not array, try different paths
      if (!Array.isArray(allMedicinesData)) {
        allMedicinesData = responseData?.medicines || responseData?.items || [];
      }
      
      if (Array.isArray(allMedicinesData) && allMedicinesData.length > 0) {
        console.log('Found medicines from API:', allMedicinesData.length);
        setAllMedicines(allMedicinesData);
      } else {
        // Fallback to mock data if API fails or returns no data
        console.warn('Using fallback mock medicine data - API returned:', allMedicinesData);
        const mockData = getAllMockMedicineData();
        setAllMedicines(mockData);
      }
    } catch (apiError) {
      console.error('Medicine API call failed, using mock data:', apiError);
      // Fallback to mock data on error
      const mockData = getAllMockMedicineData();
      setAllMedicines(mockData);
    } finally {
      setMedicineLoading(false);
    }
  };

  const getAllMockMedicineData = (): Medicine[] => {
    return [
      {
        id: '1',
        sub_category: 'Human Insulin Basal',
        product_name: 'Human Insulatard 40IU/ml Suspension for Injection',
        salt_composition: 'Insulin Isophane (40IU)',
        product_price: '₹133.93',
        product_manufactured: 'Novo Nordisk India Pvt Ltd',
        medicine_desc: 'Human Insulatard 40IU/ml Suspension for Injection is used to improve blood sugar control in adults and children with type 1 and type 2 diabetes mellitus.',
        side_effects: 'Hypoglycemia (low blood glucose level),Injection site allergic reaction,Lipodystrophy',
        drug_interactions: '{"drug": ["Benazepril", "Captopril"], "effect": ["MODERATE", "MODERATE"]}'
      },
      {
        id: '2',
        sub_category: 'Human Insulin Basal',
        product_name: 'Insulin 40IU/ml Injection',
        salt_composition: 'Insulin Isophane (40IU)',
        product_price: '₹121.91',
        product_manufactured: 'Sun Pharmaceutical Industries Ltd',
        medicine_desc: 'Insulin 40IU/ml Injection is used to improve blood sugar control in adults and children with type 1 and type 2 diabetes mellitus.',
        side_effects: 'Hypoglycemia (low blood glucose level),Injection site allergic reaction,Lipodystrophy',
        drug_interactions: '{"drug": ["Benazepril", "Captopril"], "effect": ["MODERATE", "MODERATE"]}'
      },
      {
        id: '3',
        sub_category: 'Human Insulin Basal',
        product_name: 'Huminsulin N 40IU/ml Injection',
        salt_composition: 'Insulin Isophane (40IU)',
        product_price: '₹133.45',
        product_manufactured: 'Eli Lilly and Company India Pvt Ltd',
        medicine_desc: 'Huminsulin N 40IU/ml Injection is used to improve blood sugar control in adults and children with type 1 and type 2 diabetes mellitus.',
        side_effects: 'Hypoglycemia (low blood glucose level),Injection site allergic reaction,Lipodystrophy',
        drug_interactions: '{"drug": ["Benazepril", "Captopril"], "effect": ["MODERATE", "MODERATE"]}'
      },
      {
        id: '4',
        sub_category: 'Human Insulin Basal',
        product_name: 'Insugen-N 40IU/ml Injection',
        salt_composition: 'Insulin Isophane (40IU)',
        product_price: '₹133.36',
        product_manufactured: 'Biocon',
        medicine_desc: 'Insugen-N 40IU/ml Injection is used to improve blood sugar control in adults and children with type 1 and type 2 diabetes mellitus.',
        side_effects: 'Hypoglycemia (low blood glucose level),Injection site allergic reaction,Lipodystrophy',
        drug_interactions: '{"drug": ["Benazepril", "Captopril"], "effect": ["MODERATE", "MODERATE"]}'
      },
      {
        id: '5',
        sub_category: 'Antibiotics',
        product_name: 'Amoxicillin 500mg Capsules',
        salt_composition: 'Amoxicillin (500mg)',
        product_price: '₹89.50',
        product_manufactured: 'Sun Pharma',
        medicine_desc: 'Amoxicillin is used to treat bacterial infections in many different parts of the body.',
        side_effects: 'Nausea,Vomiting,Diarrhea,Skin rash',
        drug_interactions: '{"drug": ["Warfarin"], "effect": ["MODERATE"]}'
      },
      {
        id: '6',
        sub_category: 'Pain Relief',
        product_name: 'Paracetamol 500mg Tablets',
        salt_composition: 'Paracetamol (500mg)',
        product_price: '₹25.00',
        product_manufactured: 'Cipla Ltd',
        medicine_desc: 'Paracetamol is used to treat pain and fever.',
        side_effects: 'Rare: Liver damage with overdose',
        drug_interactions: '{"drug": ["Warfarin"], "effect": ["MILD"]}'
      }
    ];
  };

  const searchMedicinesLocally = (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setMedicines([]);
      return;
    }
    
    console.log(`Searching locally for: ${searchTerm} in ${allMedicines.length} medicines`);
    
    const filteredMedicines = allMedicines.filter((medicine: Medicine) =>
      medicine.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.salt_composition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.sub_category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('Filtered medicines:', filteredMedicines.length);
    setMedicines(filteredMedicines.slice(0, 10)); // Limit to 10 results
  };

  useEffect(() => {
    if (signedIn && accessToken && visitId) {
      fetchVisitDetails();
    }
  }, [signedIn, accessToken, visitId]);

  // Fetch all medicines on component mount
  useEffect(() => {
    fetchAllMedicines();
  }, []);

  // Debounced ICD search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (icdSearchTerm.length >= 2) {
        searchIcdCodes(icdSearchTerm);
      } else {
        setIcdCodes([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [icdSearchTerm]);

  // Debounced medicine search effect - now searches locally
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (medicineSearchTerm.length >= 2) {
        console.log('Starting local medicine search for:', medicineSearchTerm);
        searchMedicinesLocally(medicineSearchTerm);
        setShowMedicineDropdown(true);
      } else {
        setMedicines([]);
        setShowMedicineDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [medicineSearchTerm, allMedicines]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowIcdDropdown(false);
      }
      if (medicineDropdownRef.current && !medicineDropdownRef.current.contains(event.target as Node)) {
        setShowMedicineDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchIcdCodes = async (searchTerm: string) => {
    try {
      setIcdLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await apiSearchIcdCodes(searchTerm);
      // const icdCodes = response.data?.data || [];
      
      // Mock ICD codes for now - replace with actual API call
      const getMockDiseaseData = (searchTerm: string, type: string): ICDCode[] => {
        const humanDiseases: ICDCode[] = [
          { value: 'type_2_diabetes', label: 'Type 2 Diabetes Mellitus', snomedId: '44054006', icdCode: 'E11', diseaseType: 'Metabolic' },
          { value: 'hypertension', label: 'Essential Hypertension', snomedId: '59621000', icdCode: 'I10', diseaseType: 'Circulatory' },
          { value: 'common_cold', label: 'Acute Nasopharyngitis', snomedId: '82272006', icdCode: 'J00', diseaseType: 'Respiratory' },
          { value: 'headache', label: 'Headache', snomedId: '25064002', icdCode: 'R51', diseaseType: 'Symptoms' },
          { value: 'fever', label: 'Fever Unspecified', snomedId: '386661006', icdCode: 'R50.9', diseaseType: 'Symptoms' },
          { value: 'bronchitis', label: 'Acute Bronchitis', snomedId: '10509002', icdCode: 'J20.9', diseaseType: 'Respiratory' },
          { value: 'pneumonia', label: 'Pneumonia', snomedId: '233604007', icdCode: 'J18.9', diseaseType: 'Respiratory' },
          { value: 'gastritis', label: 'Gastritis', snomedId: '4556007', icdCode: 'K29.70', diseaseType: 'Digestive' },
        ];
        
        const livestockDiseases: ICDCode[] = [
          { value: 'foot_mouth_disease', label: 'Foot and Mouth Disease', snomedId: '75702008', icdCode: 'A01.1', diseaseType: 'Viral' },
          { value: 'mastitis', label: 'Bovine Mastitis', snomedId: '45169008', icdCode: 'B95.2', diseaseType: 'Bacterial' },
          { value: 'pneumonia', label: 'Pneumonia in Cattle', snomedId: '233604007', icdCode: 'J18.9', diseaseType: 'Respiratory' },
          { value: 'lameness', label: 'Lameness in Livestock', snomedId: '16973004', icdCode: 'M25.50', diseaseType: 'Orthopedic' },
        ];
        
        const petDiseases: ICDCode[] = [
          { value: 'parvovirus', label: 'Canine Parvovirus', snomedId: '27481007', icdCode: 'A08.0', diseaseType: 'Viral' },
          { value: 'feline_leukemia', label: 'Feline Leukemia Virus', snomedId: '85307008', icdCode: 'B97.32', diseaseType: 'Viral' },
          { value: 'hip_dysplasia', label: 'Hip Dysplasia', snomedId: '203639008', icdCode: 'Q65.9', diseaseType: 'Orthopedic' },
          { value: 'kennel_cough', label: 'Kennel Cough', snomedId: '409709004', icdCode: 'J20.8', diseaseType: 'Respiratory' },
        ];
        
        let diseases = humanDiseases;
        if (type === 'LIVESTOCK') diseases = livestockDiseases;
        else if (type === 'PET') diseases = petDiseases;
        
    return diseases.filter(disease => 
      disease.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disease.snomedId.includes(searchTerm) ||
      disease.icdCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const fetchAllMedicines = async () => {
    try {
      setMedicineLoading(true);
      console.log('Fetching all medicines from API...');
      
      const response = await apiSearchMedicines();
      console.log('Medicine master API response:', response);
      
      // Try to extract items from response
      const responseData = response?.data as any;
      let allMedicinesData = responseData?.data || responseData || [];
      
      // If response is not array, try different paths
      if (!Array.isArray(allMedicinesData)) {
        allMedicinesData = responseData?.medicines || responseData?.items || [];
      }
      
      if (Array.isArray(allMedicinesData) && allMedicinesData.length > 0) {
        console.log('Found medicines from API:', allMedicinesData.length);
        setAllMedicines(allMedicinesData);
      } else {
        // Fallback to mock data if API fails or returns no data
        console.warn('Using fallback mock medicine data - API returned:', allMedicinesData);
        const mockData = getAllMockMedicineData();
        setAllMedicines(mockData);
      }
    } catch (apiError) {
      console.error('Medicine API call failed, using mock data:', apiError);
      // Fallback to mock data on error
      const mockData = getAllMockMedicineData();
      setAllMedicines(mockData);
    } finally {
      setMedicineLoading(false);
    }
  };

  const searchMedicinesLocally = (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setMedicines([]);
      return;
    }
    
    console.log(`Searching locally for: ${searchTerm} in ${allMedicines.length} medicines`);
    
    const filteredMedicines = allMedicines.filter((medicine: Medicine) =>
      medicine.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.salt_composition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.sub_category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('Filtered medicines:', filteredMedicines.length);
    setMedicines(filteredMedicines.slice(0, 10)); // Limit to 10 results
  };

  const getAllMockMedicineData = (): Medicine[] => {
    return [
      {
        id: '1',
        sub_category: 'Human Insulin Basal',
        product_name: 'Human Insulatard 40IU/ml Suspension for Injection',
        salt_composition: 'Insulin Isophane (40IU)',
        product_price: '₹133.93',
        product_manufactured: 'Novo Nordisk India Pvt Ltd',
        medicine_desc: 'Human Insulatard 40IU/ml Suspension for Injection is used to improve blood sugar control in adults and children with type 1 and type 2 diabetes mellitus.',
        side_effects: 'Hypoglycemia (low blood glucose level),Injection site allergic reaction,Lipodystrophy',
        drug_interactions: '{"drug": ["Benazepril", "Captopril"], "effect": ["MODERATE", "MODERATE"]}'
      },
      {
        id: '2',
        sub_category: 'Human Insulin Basal',
        product_name: 'Insulin 40IU/ml Injection',
        salt_composition: 'Insulin Isophane (40IU)',
        product_price: '₹121.91',
        product_manufactured: 'Sun Pharmaceutical Industries Ltd',
        medicine_desc: 'Insulin 40IU/ml Injection is used to improve blood sugar control in adults and children with type 1 and type 2 diabetes mellitus.',
        side_effects: 'Hypoglycemia (low blood glucose level),Injection site allergic reaction,Lipodystrophy',
        drug_interactions: '{"drug": ["Benazepril", "Captopril"], "effect": ["MODERATE", "MODERATE"]}'
      },
      {
        id: '3',
        sub_category: 'Human Insulin Basal',
        product_name: 'Huminsulin N 40IU/ml Injection',
        salt_composition: 'Insulin Isophane (40IU)',
        product_price: '₹133.45',
        product_manufactured: 'Eli Lilly and Company India Pvt Ltd',
        medicine_desc: 'Huminsulin N 40IU/ml Injection is used to improve blood sugar control in adults and children with type 1 and type 2 diabetes mellitus.',
        side_effects: 'Hypoglycemia (low blood glucose level),Injection site allergic reaction,Lipodystrophy',
        drug_interactions: '{"drug": ["Benazepril", "Captopril"], "effect": ["MODERATE", "MODERATE"]}'
      },
      {
        id: '4',
        sub_category: 'Human Insulin Basal',
        product_name: 'Insugen-N 40IU/ml Injection',
        salt_composition: 'Insulin Isophane (40IU)',
        product_price: '₹133.36',
        product_manufactured: 'Biocon',
        medicine_desc: 'Insugen-N 40IU/ml Injection is used to improve blood sugar control in adults and children with type 1 and type 2 diabetes mellitus.',
        side_effects: 'Hypoglycemia (low blood glucose level),Injection site allergic reaction,Lipodystrophy',
        drug_interactions: '{"drug": ["Benazepril", "Captopril"], "effect": ["MODERATE", "MODERATE"]}'
      },
      {
        id: '5',
        sub_category: 'Antibiotics',
        product_name: 'Amoxicillin 500mg Capsules',
        salt_composition: 'Amoxicillin (500mg)',
        product_price: '₹89.50',
        product_manufactured: 'Sun Pharma',
        medicine_desc: 'Amoxicillin is used to treat bacterial infections in many different parts of the body.',
        side_effects: 'Nausea,Vomiting,Diarrhea,Skin rash',
        drug_interactions: '{"drug": ["Warfarin"], "effect": ["MODERATE"]}'
      },
      {
        id: '6',
        sub_category: 'Pain Relief',
        product_name: 'Paracetamol 500mg Tablets',
        salt_composition: 'Paracetamol (500mg)',
        product_price: '₹25.00',
        product_manufactured: 'Cipla Ltd',
        medicine_desc: 'Paracetamol is used to treat pain and fever.',
        side_effects: 'Rare: Liver damage with overdose',
        drug_interactions: '{"drug": ["Warfarin"], "effect": ["MILD"]}'
      }
    ];
  };

  const searchMedicines = async (searchTerm: string) => {
    try {
      setMedicineLoading(true);
      
      console.log(`Searching medicines for: ${searchTerm}`);
      
      // Call actual medicine master API
      const response = await apiSearchMedicines();
      console.log('Medicine master API response:', response);
      
      // Try to extract items from response
      const responseData = response?.data as any;
      let allMedicines = responseData?.data || responseData || [];
      
      // If response is not array, try different paths
      if (!Array.isArray(allMedicines)) {
        allMedicines = responseData?.medicines || responseData?.items || [];
      }
      
      if (Array.isArray(allMedicines) && allMedicines.length > 0) {
        console.log('Found medicines from API:', allMedicines.length);
        // Client-side filtering
        const filteredMedicines = allMedicines.filter((medicine: any) =>
          medicine.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.salt_composition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          medicine.sub_category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log('Filtered medicines:', filteredMedicines.length);
        setMedicines(filteredMedicines.slice(0, 10)); // Limit to 10 results
      } else {
        // Fallback to mock data if API fails or returns no data
        console.warn('Using fallback mock medicine data - API returned:', allMedicines);
        const mockData = getMockMedicineData(searchTerm);
        setMedicines(mockData);
      }
    } catch (apiError) {
      console.error('Medicine API call failed, using mock data:', apiError);
      // Fallback to mock data on error
      const mockData = getMockMedicineData(searchTerm);
      setMedicines(mockData);
    } finally {
      setMedicineLoading(false);
    }
  };

  const getMockMedicineData = (searchTerm: string): Medicine[] => {
    const mockMedicines: Medicine[] = [
      {
        id: '1',
        sub_category: 'Human Insulin Basal',
        product_name: 'Human Insulatard 40IU/ml Suspension for Injection',
        salt_composition: 'Insulin Isophane (40IU)',
        product_price: '₹133.93',
        product_manufactured: 'Novo Nordisk India Pvt Ltd',
        medicine_desc: 'Human Insulatard 40IU/ml Suspension for Injection is used to improve blood sugar control in adults and children with type 1 and type 2 diabetes mellitus.',
        side_effects: 'Hypoglycemia (low blood glucose level),Injection site allergic reaction,Lipodystrophy',
        drug_interactions: '{"drug": ["Benazepril", "Captopril"], "effect": ["MODERATE", "MODERATE"]}'
      },
      {
        id: '2',
        sub_category: 'Antibiotics',
        product_name: 'Amoxicillin 500mg Capsules',
        salt_composition: 'Amoxicillin (500mg)',
        product_price: '₹89.50',
        product_manufactured: 'Sun Pharma',
        medicine_desc: 'Amoxicillin is used to treat bacterial infections in many different parts of the body.',
        side_effects: 'Nausea,Vomiting,Diarrhea,Skin rash',
        drug_interactions: '{"drug": ["Warfarin"], "effect": ["MODERATE"]}'
      },
      {
        id: '3',
        sub_category: 'Pain Relief',
        product_name: 'Paracetamol 500mg Tablets',
        salt_composition: 'Paracetamol (500mg)',
        product_price: '₹25.00',
        product_manufactured: 'Cipla Ltd',
        medicine_desc: 'Paracetamol is used to treat pain and fever.',
        side_effects: 'Rare: Liver damage with overdose',
        drug_interactions: '{"drug": ["Warfarin"], "effect": ["MILD"]}'
      }
    ];
    
    return mockMedicines.filter(medicine => 
      medicine.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.salt_composition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.sub_category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };      // Determine collection based on clinic type
      let collection = 'human_disease_master';
      if (clinicType === 'LIVESTOCK') {
        collection = 'livestock_disease_master';
      } else if (clinicType === 'PET') {
        collection = 'pet_disease_master';
      }
      
      console.log(`Searching ${collection} for: ${searchTerm}`);
      
      try {
        // Call actual disease master API
        const response = await apiSearchDiseaseMaster(collection, searchTerm);
        console.log('Disease master API response:', response);
        
        // Try to extract items from response, fallback to mock data if not found
        const responseData = response?.data as any;
        const items = responseData?.data?.items || [];
        if (Array.isArray(items) && items.length > 0) {
          setIcdCodes(items);
        } else {
          // Fallback to mock data if API fails
          console.warn('Using fallback mock data - no items found in response');
          const mockData = getMockDiseaseData(searchTerm, clinicType);
          setIcdCodes(mockData);
        }
      } catch (apiError) {
        console.error('API call failed, using mock data:', apiError);
        // Fallback to mock data on error
        const mockData = getMockDiseaseData(searchTerm, clinicType);
        setIcdCodes(mockData);
      }
    } catch (error) {
      console.error('Error searching ICD codes:', error);
    } finally {
      setIcdLoading(false);
    }
  };

  const addDiagnosis = (diseaseCode: ICDCode) => {
    if (!selectedDiagnoses.find(d => d.value === diseaseCode.value)) {
      setSelectedDiagnoses([...selectedDiagnoses, { ...diseaseCode, isPrimary: selectedDiagnoses.length === 0 }]);
    }
    setIcdSearchTerm('');
    setShowIcdDropdown(false);
    setIcdCodes([]);
  };

  const removeDiagnosis = (diseaseValue: string) => {
    const updatedDiagnoses = selectedDiagnoses.filter(d => d.value !== diseaseValue);
    // If we removed the primary diagnosis, make the first remaining one primary
    if (updatedDiagnoses.length > 0 && !updatedDiagnoses.some(d => d.isPrimary)) {
      updatedDiagnoses[0].isPrimary = true;
    }
    setSelectedDiagnoses(updatedDiagnoses);
  };

  const togglePrimaryDiagnosis = (diseaseValue: string) => {
    setSelectedDiagnoses(selectedDiagnoses.map(d => ({
      ...d,
      isPrimary: d.value === diseaseValue
    })));
  };

  const selectMedicine = (medicine: Medicine) => {
    console.log('Medicine selected:', medicine);
    setSelectedMedicine(medicine);
    setMedicineSearchTerm(medicine.product_name);
    setShowMedicineDropdown(false);
    setMedicines([]);
  };

  const addPrescription = () => {
    if (selectedMedicine && currentDose && currentFrequency && currentDuration) {
      const newPrescription: PrescriptionItem = {
        medicine: selectedMedicine,
        dose: currentDose,
        frequency: currentFrequency,
        duration: currentDuration
      };
      
      setPrescriptions([...prescriptions, newPrescription]);
      
      // Reset form
      setSelectedMedicine(null);
      setMedicineSearchTerm('');
      setCurrentDose('');
      setCurrentFrequency('');
      setCurrentDuration('');
    }
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const fetchVisitDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Note: You'll need to implement this API call
      // const response = await apiGetVisitDetails(visitId!);
      // For now, we'll mock the visit details
      console.log('Fetching visit details for:', visitId);
      
      // Mock visit details - replace with actual API call
      const mockVisitDetails: VisitDetails = {
        id: visitId!,
        patientId: 'patient-123',
        doctorId: 'doctor-456',
        visitType: 'CLINIC',
        symptoms: 'Fever, Headache',
        vitals: {
          temperature: 98.6,
          pulse: 72,
          bp: '120/80',
          spo2: 98
        },
        notes: 'Patient feeling unwell',
        workflowState: 'OPEN',
        patient: {
          pseudonymId: 'PAT-123',
          type: 'HUMAN',
          age: 30,
          sex: 'MALE',
          person: {
            fullName: 'John Doe'
          }
        },
        doctor: {
          person: {
            fullName: 'Dr. John Smith'
          }
        }
      };
      
      setVisitDetails(mockVisitDetails);
    } catch (error: any) {
      console.error('Error fetching visit details:', error);
      setError('Failed to fetch visit details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: DiagnosisFormData) => {
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      // Validate that at least one diagnosis is selected
      if (selectedDiagnoses.length === 0) {
        setError('Please select at least one diagnosis from the disease master');
        return;
      }
      
      // Prepare submission data with ICD codes
      const submissionData = {
        visitId: visitId,
        icdCodes: selectedDiagnoses.map(d => ({
          value: d.value,
          label: d.label,
          snomedId: d.snomedId,
          icdCode: d.icdCode,
          diseaseType: d.diseaseType,
          isPrimary: d.isPrimary
        })),
        prescriptions: prescriptions.map(p => ({
          medicine: {
            id: p.medicine.id,
            product_name: p.medicine.product_name,
            salt_composition: p.medicine.salt_composition,
            sub_category: p.medicine.sub_category,
            product_price: p.medicine.product_price
          },
          dose: p.dose,
          frequency: p.frequency,
          duration: p.duration
        })),
        prescriptionNotes: values.prescription,
        labOrders: values.labOrders,
        followUpDate: values.followUpDate,
        instructions: values.instructions
      };
      
      console.log('Submitting diagnosis data:', submissionData);
      
      // TODO: Implement diagnosis submission API
      // await apiSubmitDiagnosis(submissionData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(`Diagnosis saved successfully! ${selectedDiagnoses.length} ICD codes added.`);
      
      // Navigate back to visit list after success
      setTimeout(() => {
        navigate('/clinic/visits');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error submitting diagnosis:', error);
      setError('Failed to save diagnosis and prescription');
    } finally {
      setSubmitting(false);
    }
  };

  if (!signedIn) {
    return (
      <div className="text-center py-8">
        <Alert type="warning" className="mb-4">
          Please login first to access diagnosis form.
        </Alert>
        <Button onClick={() => navigate('/sign-in')}>
          Go to Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading visit details...</p>
      </div>
    );
  }

  if (error && !visitDetails) {
    return (
      <div className="text-center py-8">
        <Alert type="danger" className="mb-4">
          {error}
        </Alert>
        <Button onClick={fetchVisitDetails}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          onClick={() => navigate('/clinic/visits')}
          className="mb-4"
        >
          ← Back to Visits
        </Button>
        <h1 className="text-3xl font-bold">Diagnosis & Prescription</h1>
        {visitDetails && (
          <p className="text-gray-600 mt-2">
            Patient: {visitDetails.patient.person?.fullName || visitDetails.patient.pseudonymId} | Doctor: {visitDetails.doctor.person.fullName}
          </p>
        )}
      </div>

      {/* Visit Summary */}
      {visitDetails && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Visit Summary</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Patient:</strong> {visitDetails.patient.person?.fullName || visitDetails.patient.pseudonymId} ({visitDetails.patient.age}y, {visitDetails.patient.sex})</p>
              <p><strong>Visit Type:</strong> {visitDetails.visitType}</p>
              <p><strong>Symptoms:</strong> {visitDetails.symptoms}</p>
            </div>
            <div>
              <p><strong>Doctor:</strong> {visitDetails.doctor.person.fullName}</p>
              <p><strong>Status:</strong> {visitDetails.workflowState}</p>
              {visitDetails.vitals && Object.keys(visitDetails.vitals).length > 0 && (
                <p><strong>Vitals:</strong> 
                  {visitDetails.vitals.temperature && ` Temp: ${visitDetails.vitals.temperature}°F`}
                  {visitDetails.vitals.pulse && ` | Pulse: ${visitDetails.vitals.pulse} bpm`}
                  {visitDetails.vitals.bp && ` | BP: ${visitDetails.vitals.bp}`}
                  {visitDetails.vitals.spo2 && ` | SpO2: ${visitDetails.vitals.spo2}%`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <Alert type="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" className="mb-4">
          {success}
        </Alert>
      )}

      {/* Diagnosis Form */}
      <Formik<DiagnosisFormData>
        initialValues={{
          prescription: '',
          labOrders: '',
          followUpDate: '',
          instructions: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <FormContainer>
              
              {/* Diagnosis Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Diagnosis ({clinicType === 'HUMAN' ? 'Human' : clinicType === 'LIVESTOCK' ? 'Livestock' : 'Pet'} Diseases)
                </h2>
                
                {/* Clinic Type Selector */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Type
                  </label>
                  <select 
                    value={clinicType}
                    onChange={(e) => {
                      setClinicType(e.target.value);
                      setIcdCodes([]); // Clear current results
                      setSelectedDiagnoses([]); // Clear selections when type changes
                    }}
                    className="w-full border rounded p-2"
                  >
                    <option value="HUMAN">Human Medicine</option>
                    <option value="LIVESTOCK">Livestock/Farm Animals</option>
                    <option value="PET">Pet/Companion Animals</option>
                  </select>
                </div>
                
                {/* Disease Code Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Disease Master *
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <input
                      type="text"
                      value={icdSearchTerm}
                      onChange={(e) => {
                        setIcdSearchTerm(e.target.value);
                        setShowIcdDropdown(true);
                      }}
                      onFocus={() => setShowIcdDropdown(true)}
                      placeholder="Search by disease name, SNOMED ID, or ICD code (e.g., diabetes, 44054006, E11)..."
                      className="w-full border rounded p-3 pr-10"
                    />
                    {icdLoading && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                    
                    {/* Disease Codes Dropdown */}
                    {showIcdDropdown && icdCodes.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {icdCodes.map((disease) => (
                          <div
                            key={disease.value}
                            onClick={() => addDiagnosis(disease)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-blue-700">{disease.label}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">SNOMED ID:</span> {disease.snomedId} | 
                                  <span className="font-medium"> ICD:</span> {disease.icdCode}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">{disease.diseaseType}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Diagnoses */}
                {selectedDiagnoses.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Diagnoses ({selectedDiagnoses.length})
                    </label>
                    <div className="space-y-3">
                      {selectedDiagnoses.map((diagnosis) => (
                        <div
                          key={diagnosis.value}
                          className={`flex items-center justify-between rounded-lg p-4 border ${
                            diagnosis.isPrimary 
                              ? 'bg-green-50 border-green-300' 
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`font-semibold ${
                                diagnosis.isPrimary ? 'text-green-800' : 'text-blue-800'
                              }`}>
                                {diagnosis.label}
                              </div>
                              {diagnosis.isPrimary && (
                                <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full">
                                  PRIMARY
                                </span>
                              )}
                            </div>
                            <div className={`text-sm mb-1 ${
                              diagnosis.isPrimary ? 'text-green-700' : 'text-blue-700'
                            }`}>
                              <span className="font-medium">SNOMED ID:</span> {diagnosis.snomedId} | 
                              <span className="font-medium"> ICD Code:</span> {diagnosis.icdCode}
                            </div>
                            <div className={`text-xs ${
                              diagnosis.isPrimary ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {diagnosis.diseaseType}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-3">
                            {!diagnosis.isPrimary && (
                              <button
                                type="button"
                                onClick={() => togglePrimaryDiagnosis(diagnosis.value)}
                                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded hover:bg-gray-300"
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeDiagnosis(diagnosis.value)}
                              className="text-red-600 hover:text-red-800 font-bold text-lg"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prescription Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Prescription & Treatment
                </h2>
                
                {/* Medicine Search */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Medicine *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button 
                      type="button"
                      onClick={() => {
                        console.log('Test button clicked - fetching all medicines');
                        fetchAllMedicines();
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Reload Medicines
                    </button>
                    <span className="text-sm text-gray-500">
                      Debug: Loaded {allMedicines.length} medicines | Filtered: {medicines.length}
                    </span>
                  </div>
                  <div className="relative" ref={medicineDropdownRef}>
                    <input
                      type="text"
                      value={medicineSearchTerm}
                      onChange={(e) => {
                        console.log('Medicine search input changed:', e.target.value);
                        setMedicineSearchTerm(e.target.value);
                        if (selectedMedicine) {
                          setSelectedMedicine(null); // Clear selection when typing
                        }
                        setShowMedicineDropdown(true);
                      }}
                      onFocus={() => {
                        console.log('Medicine search input focused');
                        setShowMedicineDropdown(true);
                      }}
                      placeholder="Search by medicine name, salt composition, or category..."
                      className="w-full border rounded p-3 pr-10"
                    />
                    {medicineLoading && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                    
                    {/* Medicine Dropdown */}
                    {showMedicineDropdown && medicines.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {medicines.map((medicine) => (
                          <div
                            key={medicine.id}
                            onClick={() => selectMedicine(medicine)}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-blue-700">{medicine.product_name}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Salt:</span> {medicine.salt_composition}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Category:</span> {medicine.sub_category} | 
                                  <span className="font-medium"> Price:</span> {medicine.product_price} |
                                  <span className="font-medium"> Mfg:</span> {medicine.product_manufactured}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dosage Details - Show when medicine is selected */}
                {selectedMedicine && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="mb-3">
                      <h4 className="font-semibold text-blue-800">{selectedMedicine.product_name}</h4>
                      <p className="text-sm text-blue-700">{selectedMedicine.salt_composition}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dose *
                        </label>
                        <input
                          type="text"
                          value={currentDose}
                          onChange={(e) => setCurrentDose(e.target.value)}
                          placeholder="e.g., 500mg"
                          className="w-full border rounded p-2"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Frequency *
                        </label>
                        <select
                          value={currentFrequency}
                          onChange={(e) => setCurrentFrequency(e.target.value)}
                          className="w-full border rounded p-2"
                        >
                          <option value="">Select frequency</option>
                          <option value="OD">OD (Once Daily)</option>
                          <option value="BD">BD (Twice Daily)</option>
                          <option value="TDS">TDS (Three times Daily)</option>
                          <option value="QDS">QDS (Four times Daily)</option>
                          <option value="SOS">SOS (As needed)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={currentDuration}
                          onChange={(e) => setCurrentDuration(e.target.value)}
                          placeholder="e.g., 5 days"
                          className="w-full border rounded p-2"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={addPrescription}
                      disabled={!currentDose || !currentFrequency || !currentDuration}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Add to Prescription
                    </button>
                  </div>
                )}

                {/* Selected Prescriptions */}
                {prescriptions.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prescription List ({prescriptions.length} items)
                    </label>
                    <div className="space-y-3">
                      {prescriptions.map((prescription, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4"
                        >
                          <div className="flex-1">
                            <div className="font-semibold text-green-800">
                              {index + 1}. {prescription.medicine.product_name}
                            </div>
                            <div className="text-sm text-green-700 mt-1">
                              <span className="font-medium">Dose:</span> {prescription.dose} | 
                              <span className="font-medium"> Frequency:</span> {prescription.frequency} | 
                              <span className="font-medium"> Duration:</span> {prescription.duration}
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              {prescription.medicine.salt_composition} - {prescription.medicine.product_price}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removePrescription(index)}
                            className="ml-3 text-red-600 hover:text-red-800 font-bold text-lg"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lab Orders Section - TODO: Enable in future */}
              {/* <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Laboratory Tests
                </h2>
                
                <FormItem label="Lab Orders">
                  <Field 
                    name="labOrders" 
                    component="textarea"
                    rows="4"
                    placeholder="Enter required laboratory tests...
Example:
- Complete Blood Count (CBC)
- Blood Sugar (Fasting)
- Urine Routine Examination"
                    className="w-full border rounded p-3 resize-none"
                  />
                </FormItem>
              </div> */}

              {/* Follow-up Section - TODO: Enable in future */}
              {/* <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Follow-up & Instructions
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <FormItem label="Follow-up Date">
                    <Field 
                      name="followUpDate" 
                      type="date" 
                      component={Input}
                      className="w-full"
                    />
                  </FormItem>
                </div>

                <FormItem label="Special Instructions & Advice">
                  <Field 
                    name="instructions" 
                    component="textarea"
                    rows="4"
                    placeholder="Enter special instructions for the patient...
Example:
- Take complete rest for 2-3 days
- Drink plenty of fluids
- Avoid spicy and oily food
- Return if symptoms worsen"
                    className="w-full border rounded p-3 resize-none"
                  />
                </FormItem>
              </div> */}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  onClick={() => navigate('/clinic/visits')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="solid" 
                  type="submit"
                  loading={submitting}
                  disabled={submitting}
                  className="bg-blue-600 text-white px-8"
                >
                  {submitting ? 'Saving...' : 'Save Diagnosis & Prescription'}
                </Button>
              </div>

            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
}