import React from 'react'
import PetHealthDashboard from '@/components/petHealthDashboard'

const PetHealthView = () => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Pet Health</h2>
            <PetHealthDashboard />
        </div>
    )
}

export default PetHealthView
