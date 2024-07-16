import App from './App.jsx';
import Login from './components/Login.jsx';
import ErrorPage from './components/ErrorPage.jsx';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
];

export default routes;
