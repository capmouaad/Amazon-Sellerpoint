import Loadable from 'react-loadable';
import Loader from './components/Loader';
import Admin from './containers/Admin';
import Profile from './containers/Profile'
import ChangePassword from './containers/ChangePassword'
import { userIsAuthenticatedRedir, userIsNotAuthenticatedRedir } from './services/Auth'

function MyLoadable(opts) {
  return Loadable(Object.assign({
    loading: Loader,
    delay: 300,
    timeout: 10000,
  }, opts));
};

export const Dashboard = MyLoadable({
  loader: () => import("./pages/Dashboard"),
  modules: ['./pages/Dashboard'],
  webpack: () => [require.resolveWeak('./pages/Dashboard')]
});
export const Login = MyLoadable({
  loader: () => import("./pages/Login"),
  modules: ['./pages/Login'],
  webpack: () => [require.resolveWeak('./pages/Login')]
});
export const Signup = MyLoadable({
  loader: () => import("./pages/Signup"),
  modules: ['./pages/Signup'],
  webpack: () => [require.resolveWeak('./pages/Signup')]
});
export const LWACallback = MyLoadable({
  loader: () => import("./pages/LWACallback"),
  modules: ['./pages/LWACallback'],
  webpack: () => [require.resolveWeak('./pages/LWACallback')]
});
export const ForgotPassword = MyLoadable({
  loader: () => import("./pages/ForgotPassword"),
  modules: ['./pages/ForgotPassword'],
  webpack: () => [require.resolveWeak('./pages/ForgotPassword')]
});
export const Tester = MyLoadable({
  loader: () => import("./pages/Tester"),
  modules: ['./pages/Tester'],
  webpack: () => [require.resolveWeak('./pages/Tester')]
});
export const KMLogin = MyLoadable({
  loader: () => import("./pages/KMLogin"),
  modules: ['./pages/KMLogin'],
  webpack: () => [require.resolveWeak('./pages/KMLogin')]
});
export const NotFound = MyLoadable({
  loader: () => import("./pages/NotFound"),
  modules: ['./pages/NotFound'],
  webpack: () => [require.resolveWeak('./pages/NotFound')]
});

export const routes = [
  {
    isExact: true,
    path: '/',
    name: 'Dashboard',
    component: userIsAuthenticatedRedir(Dashboard)
  },
  {
    isExact: true,
    path: '/login',
    name: 'Login',
    component: userIsNotAuthenticatedRedir(Login)
  },
  {
    isExact: true,
    isKMRoute: true,
    path: '/Account/Login',
    name: 'KMLogin',
    component: userIsNotAuthenticatedRedir(KMLogin)
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/dash',
    name: 'Dashboard',
    component: userIsAuthenticatedRedir(Dashboard)
  },
  {
    path: '/LWACallback',
    name: 'LWACallback',
    component: LWACallback
  },
  {
    path: '/forgotpassword',
    name: 'ForgotPassword',
    component: userIsNotAuthenticatedRedir(ForgotPassword)
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
  },
  {
    path: '/changepassword',
    name: 'changepassword',
    component: ChangePassword,
  },
  {
    path: '/Tester',
    name: 'Tester',
    component: Tester
  },
  {
    path: '',
    component: NotFound
  }
];
