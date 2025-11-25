import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui'

const Home = () => {
    const navigate = useNavigate()

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">OneHealth Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-3">Visit Management</h3>
                    <div className="space-y-2">
                        <Button 
                            className="w-full"
                            onClick={() => navigate('/clinic/visits')}
                        >
                            View Visit List
                        </Button>
                        <Button 
                            variant="solid"
                            className="w-full bg-green-600 text-white"
                            onClick={() => navigate('/clinic/visit/create')}
                        >
                            Create New Visit
                        </Button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-3">Patient Management</h3>
                    <div className="space-y-2">
                        <Button 
                            className="w-full"
                            onClick={() => navigate('/patient-registration')}
                        >
                            Register Patient
                        </Button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-3">Staff Management</h3>
                    <div className="space-y-2">
                        <Button 
                            className="w-full"
                            onClick={() => navigate('/doctor-registration')}
                        >
                            Register Doctor
                        </Button>
                        <Button 
                            className="w-full"
                            onClick={() => navigate('/staff-registration')}
                        >
                            Register Staff
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
