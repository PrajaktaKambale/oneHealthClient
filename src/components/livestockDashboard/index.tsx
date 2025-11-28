import React from 'react'
import Card from '@/components/ui/Card'
import MonthlyVisitsBySpecies from './charts/MonthlyVisitsBySpecies'
import FarmSizeBuckets from './charts/FarmSizeBuckets'
import HeatmapByDistrict from './charts/HeatmapByDistrict'
import NotifiableDiseaseBreakdown from './charts/NotifiableDiseaseBreakdown'
import VisitTrend from './charts/VisitTrend'
import LabUtilizationRate from './charts/LabUtilizationRate'

const LivestockDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card><MonthlyVisitsBySpecies /></Card>
            <Card><FarmSizeBuckets /></Card>
            <Card><HeatmapByDistrict /></Card>
            <Card><NotifiableDiseaseBreakdown /></Card>
            <Card><VisitTrend /></Card>
            <Card><LabUtilizationRate /></Card>
        </div>
    )
}

export default LivestockDashboard
