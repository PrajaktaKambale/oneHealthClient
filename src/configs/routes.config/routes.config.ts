// import { lazy } from 'react'
// import authRoute from './authRoute'
// import type { Routes } from '@/@types/routes'

// export const publicRoutes: Routes = [...authRoute]

// export const protectedRoutes = [
//     {
//         key: 'home',
//         path: '/home',
//         component: lazy(() => import('@/views/Home')),
//         authority: [],
//     },
//     {
//         key: 'clinic',
//         path: '/clinic-registration',
//         component: lazy(() => import('@/views/clinic/clinicRegistration')),
//         authority: [],
//     },
//     {
//         key: 'doctor',
//         path: '/doctor-registration',
//         component: lazy(() => import('@/views/clinic/doctorRegistration')),
//         authority: [],
//     },
//     {
//         key: 'patient',
//         path: '/patient-registration',
//         component: lazy(() => import('@/views/clinic/patient')),
//         authority: [],
//     },
//     {
//         key: 'staff',
//         path: '/staff-registration',
//         component: lazy(() => import('@/views/clinic/staff')),
//         authority: [],
//     },
//     {
//         key: 'consultation',
//         path: '/doctor-consultation',
//         component: lazy(() => import('@/views/clinic/doctorConsultation')),
//         authority: [],
//     },
//     /** Example purpose only, please remove */
//     {
//         key: 'singleMenuItem',
//         path: '/single-menu-view',
//         component: lazy(() => import('@/views/demo/SingleMenuView')),
//         authority: [],
//     },
//     {
//         key: 'collapseMenu.item1',
//         path: '/collapse-menu-item-view-1',
//         component: lazy(() => import('@/views/demo/CollapseMenuItemView1')),
//         authority: [],
//     },
//     {
//         key: 'collapseMenu.item2',
//         path: '/collapse-menu-item-view-2',
//         component: lazy(() => import('@/views/demo/CollapseMenuItemView2')),
//         authority: [],
//     },
//     {
//         key: 'groupMenu.single',
//         path: '/group-single-menu-item-view',
//         component: lazy(() => import('@/views/demo/GroupSingleMenuItemView')),
//         authority: [],
//     },
//     {
//         key: 'groupMenu.collapse.item1',
//         path: '/group-collapse-menu-item-view-1',
//         component: lazy(
//             () => import('@/views/demo/GroupCollapseMenuItemView1'),
//         ),
//         authority: [],
//     },
//     {
//         key: 'groupMenu.collapse.item2',
//         path: '/group-collapse-menu-item-view-2',
//         component: lazy(
//             () => import('@/views/demo/GroupCollapseMenuItemView2'),
//         ),
//         authority: [],
//     },
// ]

import { lazy } from "react";
import authRoute from "./authRoute";
import type { Routes } from "@/@types/routes";

export const publicRoutes: Routes = [...authRoute];

export const protectedRoutes: Routes = [
  // {
  //   key: "home",
  //   path: "/home",
  //   component: lazy(() => import("@/views/Home")),
  //   authority: [],
  // },

  // -------------------------
  // TENANTS MANAGEMENT
  // -------------------------
  {
    key: "tenant.list",
    path: "/tenants",
    component: lazy(() => import("@/views/tenants/TenantList/index")),
    authority: ["SUPER_ADMIN"],
  },
  {
    key: "tenant.create",
    path: "/tenants/create",
    component: lazy(() => import("@/views/tenants/CreateTenant")),
    authority: ["SUPER_ADMIN"],
  },
  {
    key: "tenant.subscription",
    path: "/tenants/subscriptions",
    component: lazy(() => import("@/views/tenants/Subscriptions")),
    authority: ["SUPER_ADMIN"],
  },

  // -------------------------
  // CLINIC REGISTRATIONS
  // -------------------------
  {
    key: "clinic.registration",
    path: "/clinic-registration",
    component: lazy(() => import("@/views/clinic/clinicRegistration")),
    authority: [],
  },
  {
    key: "doctor.registration",
    path: "/doctor-registration",
    component: lazy(() => import("@/views/clinic/doctorRegistration")),
    authority: [],
  },
  {
    key: "patient.registration",
    path: "/patient-registration",
    component: lazy(() => import("@/views/clinic/patient")),
    authority: [],
  },
  {
    key: "staff.registration",
    path: "/staff-registration",
    component: lazy(() => import("@/views/clinic/staff")),
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

  // -------------------------
  // CONSULTATION
  // -------------------------
  {
    key: "doctor.consultation",
    path: "/doctor-consultation",
    component: lazy(() => import("@/views/clinic/doctorConsultation")),
    authority: [],
  },

  // -------------------------
  // USERS
  // -------------------------
  {
    key: "users.list",
    path: "/users",
    component: lazy(() => import("@/views/users/UserList")),
    authority: ["SUPER_ADMIN"],
  },
  {
    key: "users.assign.roles",
    path: "/users/assign-role",
    component: lazy(() => import("@/views/users/AssignRoles")),
    authority: ["SUPER_ADMIN"],
  },

  // -------------------------
  // CLINICS
  // -------------------------
  {
    key: "clinics.list",
    path: "/clinics",
    component: lazy(() => import("@/views/clinic/ClinicsList")),
    authority: ["SUPER_ADMIN"],
  },

  // -------------------------
  // ANALYTICS / REPORTS
  // -------------------------
  {
    key: "dashboard",
    path: "/dashboard/human-health",
    component: lazy(() => import("@/views/dashboard/Dashboard")),
    authority: [],
  },
  {
    key: "dashboard.pet",
    path: "/dashboard/pet-health",
    component: lazy(() => import("@/views/dashboard/PetHealth")),
    authority: [],
  },
  {
    key: "dashboard.livestock",
    path: "/dashboard/livestock",
    component: lazy(() => import("@/views/dashboard/Livestock")),
    authority: [],
  },
  {
    key: "dashboard.onehealth",
    path: "/dashboard/onehealth-hub",
    component: lazy(() => import("@/views/dashboard/OneHealthHub")),
    authority: [],
  },
  {
    key: "analytics.statistics",
    path: "/analytics/statistics",
    component: lazy(() => import("@/views/analytics/SystemStatistics")),
    authority: ["SUPER_ADMIN"],
  },
  {
    key: "analytics.outbreaks",
    path: "/analytics/outbreak-events",
    component: lazy(() => import("@/views/analytics/OutbreakEvents")),
    authority: ["SUPER_ADMIN"],
  },

  // -------------------------
  // AUDIT LOGS
  // -------------------------
//   {
//     key: "audit.logs",
//     path: "/audit-logs",
//     component: lazy(() => import("@/views/audit/AuditLogs")),
//     authority: ["SUPER_ADMIN"],
//   },

  // -------------------------
  // SETTINGS
  // -------------------------
  {
    key: "settings",
    path: "/settings",
    component: lazy(() => import("@/views/settings/Settings")),
    authority: ["SUPER_ADMIN"],
  },
];
