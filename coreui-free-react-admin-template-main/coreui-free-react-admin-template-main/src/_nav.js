import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilListRich,
  cilViewColumn,
  cilPlus,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

 {
  component: CNavGroup,
  name: 'Products',
  to: '/products',
  icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'View Products',
      to: '/products/view',
    },
    {
      component: CNavItem,
      name: 'Add Products',
      to: '/products/add',
    },
  ],
},

{
  component: CNavGroup,
  name: 'Offer Products',
  to: '/offer-products',
  icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'List Offer Products',
      to: '/offer-products/list',
    },
     {
      component: CNavItem,
      name: 'Add Offer Product',
      to: '/offer-products/add',
    },

  ],
},

{
  component: CNavGroup,
  name: 'Master Categories',
  to: '/master-categories',
  icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add Master Category',
      to: '/master-categories/add',
    },
    {
      component: CNavItem,
      name: 'View Master Categories',
      to: '/master-categories/view',
    },
  ],
},

{
  component: CNavGroup,
  name: 'Sub Categories',
  to: '/sub-categories',
  icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'Add Sub Category',
      to: '/sub-categories/add',
    },
    {
      component: CNavItem,
      name: 'View Sub Categories',
      to: '/sub-categories/view',
    },
  ],
},

{
  component: CNavGroup,
  name: 'Orders',
  to: '/orders',
  icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
  items: [
    {
      component: CNavItem,
      name: 'All Orders',
      to: '/orders/list',
    },
  ],
},
]

export default _nav
