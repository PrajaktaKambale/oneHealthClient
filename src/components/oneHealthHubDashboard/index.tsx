import React from 'react'
import Card from '@/components/ui/Card'
import DiseaseCasesBySpecies from './charts/DiseaseCasesBySpecies'
import CrossSpeciesTimeline from './charts/CrossSpeciesTimeline'
import MultiSpeciesGeoCluster from './charts/MultiSpeciesGeoCluster'
import AirQualityVsRespiratoryCases from './charts/AirQualityVsRespiratoryCases'
import PredictedVsActualCases from './charts/PredictedVsActualCases'
import ExposureChainDistribution from './charts/ExposureChainDistribution'

const OneHealthHubDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card><DiseaseCasesBySpecies /></Card>
            <Card><CrossSpeciesTimeline /></Card>
            <Card><MultiSpeciesGeoCluster /></Card>
            <Card><AirQualityVsRespiratoryCases /></Card>
            <Card><PredictedVsActualCases /></Card>
            <Card><ExposureChainDistribution /></Card>
        </div>
    )
}

export default OneHealthHubDashboard
