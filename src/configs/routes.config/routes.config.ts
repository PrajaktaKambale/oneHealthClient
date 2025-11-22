import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    {
        key: 'clinic',
        path: '/clinic-registration',
        component: lazy(() => import('@/views/clinic/clinicRegistration')),
        authority: [],
    },
    {
        key: 'doctor',
        path: '/doctor-registration',
        component: lazy(() => import('@/views/clinic/doctorRegistration')),
        authority: [],
    },
    {
        key: 'patient',
        path: '/patient-registration',
        component: lazy(() => import('@/views/clinic/patient')),
        authority: [],
    },
    {
        key: 'staff',
        path: '/staff-registration',
        component: lazy(() => import('@/views/clinic/staff')),
        authority: [],
    },
    {
        key: 'consultation',
        path: '/doctor-consultation',
        component: lazy(() => import('@/views/clinic/doctorConsultation')),
        authority: [],
    },
    {
        key: 'visits',
        path: '/clinic/visits',
        component: lazy(() => import('@/views/clinic/visitList/visitList')),
        authority: [],
    },
    {
        key: 'visit-create',
        path: '/clinic/visit/create',
        component: lazy(() => import('@/views/clinic/visitCreation/visitCreation')),
        authority: [],
    },
    {
        key: 'visit-diagnosis',
        path: '/clinic/visit/:visitId/diagnosis',
        component: lazy(() => import('@/views/clinic/diagnosisForm/diagnosisForm')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'singleMenuItem',
        path: '/single-menu-view',
        component: lazy(() => import('@/views/demo/SingleMenuView')),
        authority: [],
    },
    {
        key: 'collapseMenu.item1',
        path: '/collapse-menu-item-view-1',
        component: lazy(() => import('@/views/demo/CollapseMenuItemView1')),
        authority: [],
    },
    {
        key: 'collapseMenu.item2',
        path: '/collapse-menu-item-view-2',
        component: lazy(() => import('@/views/demo/CollapseMenuItemView2')),
        authority: [],
    },
    {
        key: 'groupMenu.single',
        path: '/group-single-menu-item-view',
        component: lazy(() => import('@/views/demo/GroupSingleMenuItemView')),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/group-collapse-menu-item-view-1',
        component: lazy(
            () => import('@/views/demo/GroupCollapseMenuItemView1'),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/group-collapse-menu-item-view-2',
        component: lazy(
            () => import('@/views/demo/GroupCollapseMenuItemView2'),
        ),
        authority: [],
    },
]
 