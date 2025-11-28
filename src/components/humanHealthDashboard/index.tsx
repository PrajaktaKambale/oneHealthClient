import AgeSexDistribution from './ageSexDistribution'
import DiseaseDistribution from './diseaseDistribution'
import FollowUpIntensity from './followUpIntensity'
import HumanVisitTrend from './humanVisitTrend'
import PatientVisitTypeDistribution from './patientVisitTypeDistribution'
import VaccinationTimeline from './vacinationTimeline'
import Card from '@/components/ui/Card'
import TopPrescribedMedicines from './topPrescribedMedicines'
const Dashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <Card>
                <HumanVisitTrend />
            </Card>
            <Card>
                <VaccinationTimeline />
            </Card>
            <Card>
                <AgeSexDistribution />
            </Card>
            <Card>
                <PatientVisitTypeDistribution />
            </Card>
            <Card>
                <DiseaseDistribution />
            </Card>
            <Card>
                <FollowUpIntensity />
            </Card>
            <Card>
                <TopPrescribedMedicines />
            </Card>
        </div>
    )
}

export default Dashboard
