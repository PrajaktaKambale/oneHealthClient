import React from 'react'
import Card from '@/components/ui/Card'
import ComparativeAnalysis from './charts/ComparativeAnalysis'
import PatientCountByBreed from './charts/PatientCountByBreed'
import VaccinationCoverage from './charts/VaccinationCoverage'
import DewormingTrend from './charts/DewormingTrend'
import PetsPerOwner from './charts/PetsPerOwner'
import RegionMapPlaceholder from './charts/RegionMapPlaceholder'

const PetHealthDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card><ComparativeAnalysis /></Card>
            <Card><PatientCountByBreed /></Card>
            <Card><VaccinationCoverage /></Card>
            <Card><DewormingTrend /></Card>
            <Card><PetsPerOwner /></Card>
            <Card><RegionMapPlaceholder /></Card>
        </div>
    )
}

export default PetHealthDashboard
