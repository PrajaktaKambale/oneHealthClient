import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    {
        key: 'clinic',
        path: '',
        title: 'Clinic',
        translateKey: 'nav.clinic',
        icon: ' ',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'clinic.registration',
                path: '/clinic-registration',
                title: 'Clinic-Registration',
                translateKey: 'nav.clinic.registration',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'doctor.registration',
                path: '/doctor-registration',
                title: 'Doctor-Registration',
                translateKey: 'nav.doctor.registration',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'patient.registration',
                path: '/patient-registration',
                title: 'Patient-Registration',
                translateKey: 'nav.patient.registration',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
             {
                key: 'staff.registration',
                path: '/staff-registration',
                title: 'Staff-Registration',
                translateKey: 'nav.staff.registration',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'doctor.consultation',
                path: '/doctor-consultation',
                title: 'Doctor Consultation',
                translateKey: 'nav.doctor.consultation',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'visit.list',
                path: '/clinic/visits',
                title: 'Visit List',
                translateKey: 'nav.visit.list',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'visit.create',
                path: '/clinic/visit/create',
                title: 'Create Visit',
                translateKey: 'nav.visit.create',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },

        ],
    },
]

export default navigationConfig
 