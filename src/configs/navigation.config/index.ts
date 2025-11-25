// import {
//     NAV_ITEM_TYPE_TITLE,
//     NAV_ITEM_TYPE_ITEM,
//     NAV_ITEM_TYPE_COLLAPSE,
// } from '@/constants/navigation.constant'
// import type { NavigationTree } from '@/@types/navigation'

// const navigationConfig: NavigationTree[] = [
//     {
//         key: 'home',
//         path: '/home',
//         title: 'Home',
//         translateKey: 'nav.home',
//         icon: 'home',
//         type: NAV_ITEM_TYPE_ITEM,
//         authority: [],
//         subMenu: [],
//     },
//     {
//         key: 'clinic',
//         path: '',
//         title: 'Clinic',
//         translateKey: 'nav.clinic',
//         icon: ' ',
//         type: NAV_ITEM_TYPE_COLLAPSE,
//         authority: [],
//         subMenu: [
//             {
//                 key: 'clinic.registration',
//                 path: '/clinic-registration',
//                 title: 'Clinic-Registration',
//                 translateKey: 'nav.clinic.registration',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'doctor.registration',
//                 path: '/doctor-registration',
//                 title: 'Doctor-Registration',
//                 translateKey: 'nav.doctor.registration',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'patient.registration',
//                 path: '/patient-registration',
//                 title: 'Patient-Registration',
//                 translateKey: 'nav.patient.registration',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//              {
//                 key: 'staff.registration',
//                 path: '/staff-registration',
//                 title: 'Staff-Registration',
//                 translateKey: 'nav.staff.registration',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },
//             {
//                 key: 'doctor.consultation',
//                 path: '/doctor-consultation',
//                 title: 'Doctor Consultation',
//                 translateKey: 'nav.doctor.consultation',
//                 icon: '',
//                 type: NAV_ITEM_TYPE_ITEM,
//                 authority: [],
//                 subMenu: [],
//             },

//         ],
//     },
// ]

// export default navigationConfig

import {
  NAV_ITEM_TYPE_TITLE,
  NAV_ITEM_TYPE_ITEM,
  NAV_ITEM_TYPE_COLLAPSE,
} from "@/constants/navigation.constant";
import type { NavigationTree } from "@/@types/navigation";

const navigationConfig: NavigationTree[] = [
  {
    key: "dashboard",
    path: "/dashboard",
    title: "Dashboard",
    translateKey: "nav.dashboard",
    icon: "dashboard",
    type: NAV_ITEM_TYPE_ITEM,
    authority: ["SUPER_ADMIN"],
    subMenu: [],
  },

  // -------------------------
  // TENANTS MANAGEMENT
  // -------------------------
  {
    key: "tenant.management",
    path: "",
    title: "Tenants Management",
    translateKey: "nav.tenant.management",
    icon: "tenantManagement",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: ["SUPER_ADMIN"],
    subMenu: [
      {
        key: "tenant.list",
        path: "/tenants",
        title: "List Tenants",
        translateKey: "nav.tenant.list",
        icon: "tenantsList",
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["SUPER_ADMIN"],
        subMenu: [],
      },
      {
        key: "tenant.create",
        path: "/tenants/create",
        title: "Create Tenant",
        translateKey: "nav.tenant.create",
        icon: "tenantCreate",
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["SUPER_ADMIN"],
        subMenu: [],
      },
      {
        key: "clinic.registration",
        path: "/clinic-registration",
        title: "Clinic-Registration",
        translateKey: "nav.clinic.registration",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      {
        key: "tenant.subscription",
        path: "/tenants/subscriptions",
        title: "Subscription Management",
        translateKey: "nav.tenant.subscription",
        icon: "tenantSubscription",
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["SUPER_ADMIN"],
        subMenu: [],
      },
    ],
  },

  // -------------------------
  // USERS
  // -------------------------
  {
    key: "users",
    path: "",
    title: "Users",
    translateKey: "nav.users",
    icon: "users",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: ["SUPER_ADMIN"],
    subMenu: [
      {
        key: "users.list",
        path: "/users",
        title: "List All Users",
        translateKey: "nav.users.list",
        icon: "usersList",
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["SUPER_ADMIN"],
        subMenu: [],
      },
      {
        key: "users.assign.roles",
        path: "/users/assign-role",
        title: "Assign Roles",
        translateKey: "nav.users.assign.roles",
        icon: "assignRoles",
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["SUPER_ADMIN"],
        subMenu: [],
      },

      {
        key: "doctor.registration",
        path: "/doctor-registration",
        title: "Doctor-Registration",
        translateKey: "nav.doctor.registration",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      {
        key: "patient.registration",
        path: "/patient-registration",
        title: "Patient-Registration",
        translateKey: "nav.patient.registration",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
      {
        key: "staff.registration",
        path: "/staff-registration",
        title: "Staff-Registration",
        translateKey: "nav.staff.registration",
        icon: "",
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
      },
    ],
  },

  // -------------------------
  // CLINICS
  // -------------------------
  {
    key: "clinics",
    path: "",
    title: "Clinics",
    translateKey: "nav.clinics",
    icon: "clinics",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: ["SUPER_ADMIN"],
    subMenu: [
      {
        key: "clinics.list",
        path: "/clinics",
        title: "List Clinics",
        translateKey: "nav.clinics.list",
        icon: "clinicsList",
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["SUPER_ADMIN"],
        subMenu: [],
      },

      {
        key: "doctor.consultation",
        path: "/doctor-consultation",
        title: "Doctor Consultation",
        translateKey: "nav.doctor.consultation",
        icon: "",
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

      //   {
      //     key: "clinics.create",
      //     path: "/clinics/create",
      //     title: "Create Clinic",
      //     translateKey: "nav.clinics.create",
      //     icon: "clinicCreate",
      //     type: NAV_ITEM_TYPE_ITEM,
      //     authority: ["SUPER_ADMIN"],
      //     subMenu: [],
      //   },
    ],
  },

  // -------------------------
  // ANALYTICS / REPORTS
  // -------------------------
  {
    key: "analytics",
    path: "",
    title: "Analytics / Reports",
    translateKey: "nav.analytics",
    icon: "analytics",
    type: NAV_ITEM_TYPE_COLLAPSE,
    authority: ["SUPER_ADMIN"],
    subMenu: [
      {
        key: "analytics.statistics",
        path: "/analytics/statistics",
        title: "System-wide Statistics",
        translateKey: "nav.analytics.statistics",
        icon: "statistics",
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["SUPER_ADMIN"],
        subMenu: [],
      },
      {
        key: "analytics.outbreaks",
        path: "/analytics/outbreak-events",
        title: "Outbreaks / Data Events",
        translateKey: "nav.analytics.outbreaks",
        icon: "outbreaks",
        type: NAV_ITEM_TYPE_ITEM,
        authority: ["SUPER_ADMIN"],
        subMenu: [],
      },
    ],
  },

  // -------------------------
  // AUDIT LOGS
  // -------------------------
//   {
//     key: "audit.logs",
//     path: "/audit-logs",
//     title: "Audit Logs",
//     translateKey: "nav.audit.logs",
//     icon: "auditLogs",
//     type: NAV_ITEM_TYPE_ITEM,
//     authority: ["SUPER_ADMIN"],
//     subMenu: [],
//   },

  // -------------------------
  // SETTINGS
  // -------------------------
  {
    key: "settings",
    path: "/settings",
    title: "Settings",
    translateKey: "nav.settings",
    icon: "settings",
    type: NAV_ITEM_TYPE_ITEM,
    authority: ["SUPER_ADMIN"],
    subMenu: [],
  },
];

export default navigationConfig;
