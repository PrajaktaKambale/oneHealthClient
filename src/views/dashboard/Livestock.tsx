import React from 'react'
import LivestockDashboard from '@/components/livestockDashboard'

const LivestockView = () => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Livestock</h2>
            <LivestockDashboard />
        </div>
    )
}

export default LivestockView
