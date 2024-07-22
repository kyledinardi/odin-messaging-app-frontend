import { redirect } from 'react-router-dom';
import App from './App.jsx';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import ErrorPage from './components/ErrorPage.jsx';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: () => (localStorage.getItem('token') ? null : redirect('/login')),
  },
  {
    path: '/sign-up',
    element: <SignUp />,
    errorElement: <ErrorPage />,
    loader: () => (localStorage.getItem('token') ? redirect('/') : null),
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
