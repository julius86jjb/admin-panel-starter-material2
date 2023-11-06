import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },

  {
    name: 'Main',
    title: true
  },
  {
    name: 'Users',
    iconComponent: { name: 'cilUser' },
    children: [
      {
        name: 'User List',
        url: '/admin/usuarios/'
      },
      {
        name: 'New User',
        url: '/admin/usuarios/nuevo'
      },

    ]
  },

];
