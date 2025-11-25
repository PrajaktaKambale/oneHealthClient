import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Alert } from '@/components/ui';
import { useAppSelector } from '@/store';
import { apiGetOngoingVisits } from '@/services/ConsultationService';

interface VisitData {
  id: string;
  tenantId: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  visitType: string;
  startedAt: string;
  endedAt?: string;
  symptoms: string;
  vitals: {
    temperature?: number;
    pulse?: number;
    bp?: string;
    spo2?: number;
  };
  notes?: string;
  workflowState: string;
  createdAt: string;
  updatedAt: string;
  nextVisitAt?: string;
  patient: {
    id: string;
    pseudonymId: string;
    type: string;
    age: number;
    sex: string;
    species?: string;
    person?: {
      fullName: string;
    };
  };
  doctor: {
    id: string;
    username: string;
    emailId: string;
    person: {
      fullName: string;
    };
  };
  clinic: {
    id: string;
    name: string;
    clinicType: string;
  };
}

interface OngoingVisitsResponse {
  success: boolean;
  data: {
    success: boolean;
    message: string;
    data: VisitData[];
  };
  message: string;
  timestamp: string;
  method: string;
  path: string;
  requestId: string;
}

export default function VisitListPage() {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Get clinic ID from Redux
  const { signedIn, accessToken } = useAppSelector((state) => state.auth.session);
  const user = useAppSelector((state) => state.auth.user);
  const clinicId = user.clinicId;

  useEffect(() => {
    if (signedIn && accessToken && clinicId) {
      fetchOngoingVisits();
    }
  }, [signedIn, accessToken, clinicId]);

  const fetchOngoingVisits = async () => {
    if (!clinicId) {
      setError('No clinic ID available');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching ongoing visits for clinic:', clinicId);
      
      const response = await apiGetOngoingVisits(clinicId);
      console.log('Ongoing visits API response:', response);
      
      const apiResponse = response as any; // Type assertion for now
      if (apiResponse?.data?.success && apiResponse.data.data?.success && Array.isArray(apiResponse.data.data.data)) {
        setVisits(apiResponse.data.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error fetching ongoing visits:', error);
      setError(error?.response?.data?.message || error?.message || 'Failed to fetch visits');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatVitals = (vitals: VisitData['vitals']) => {
    const parts = [];
    if (vitals.temperature) parts.push(`Temp: ${vitals.temperature}°F`);
    if (vitals.pulse) parts.push(`Pulse: ${vitals.pulse} bpm`);
    if (vitals.bp) parts.push(`BP: ${vitals.bp}`);
    if (vitals.spo2) parts.push(`SpO2: ${vitals.spo2}%`);
    return parts.join(' | ');
  };

  if (!signedIn || !clinicId) {
    return (
      <div className="text-center py-8">
        <Alert type="warning" className="mb-4">
          Please login first to view visits.
        </Alert>
        <Button onClick={() => navigate('/sign-in')}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ongoing Visits</h1>
        <Button 
          variant="solid" 
          onClick={() => navigate('/clinic/visit/create')}
          className="bg-green-600 text-white"
        >
          Create New Visit
        </Button>
      </div>

      {error && (
        <Alert type="danger" className="mb-4">
          {error}
          <Button 
            size="sm" 
            className="ml-2"
            onClick={fetchOngoingVisits}
          >
            Retry
          </Button>
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading visits...</p>
        </div>
      ) : visits.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ongoing visits</h3>
          <p className="text-gray-500 mb-4">Create a new visit to get started.</p>
          <Button 
            variant="solid" 
            onClick={() => navigate('/clinic/visit/create')}
            className="bg-green-600 text-white"
          >
            Create First Visit
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {visits.map((visit) => (
            <div key={visit.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {visit.patient.person?.fullName || visit.patient.pseudonymId} - {visit.patient.type} Patient
                  </h3>
                  <p className="text-sm text-gray-600">
                    Dr. {visit.doctor.person.fullName} | {visit.visitType} Visit
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="solid"
                    onClick={() => navigate(`/clinic/visit/${visit.id}/diagnosis`)}
                    className="bg-blue-600 text-white"
                  >
                    Add Diagnosis
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/clinic/visit/${visit.id}/details`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Patient Info</h4>
                  <p className="text-sm text-gray-600">
                    Age: {visit.patient.age} | Sex: {visit.patient.sex}
                    {visit.patient.species && ` | Species: ${visit.patient.species}`}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Visit Info</h4>
                  <p className="text-sm text-gray-600">
                    Started: {formatDate(visit.startedAt)}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Symptoms</h4>
                <p className="text-sm text-gray-600">{visit.symptoms}</p>
              </div>

              {Object.keys(visit.vitals).length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-1">Vitals</h4>
                  <p className="text-sm text-gray-600">{formatVitals(visit.vitals)}</p>
                </div>
              )}

              {visit.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-1">Notes</h4>
                  <p className="text-sm text-gray-600">{visit.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  visit.workflowState === 'OPEN' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {visit.workflowState}
                </span>
                <span className="text-xs text-gray-500">
                  Visit ID: {visit.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Button 
          onClick={fetchOngoingVisits}
          disabled={loading}
          className="bg-gray-100 text-gray-700"
        >
          Refresh Visits
        </Button>
      </div>
    </div>
  );
}