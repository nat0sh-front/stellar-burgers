import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredientsThunk } from '../../services/slices/ingredientsSlice';
import { getCookie } from '../../utils/cookie';
import { getUserThunk } from '../../services/slices/userSlice';
import { OrderInfoModal } from '../order-info/order-info';
import { IngredientDetailsModal } from '../ingredient-details/ingredient-details';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredientsThunk());
    if (getCookie('accessToken')) {
      dispatch(getUserThunk());
    }
  }, []);

  return (
<div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
        >
          <Route index element={<ProtectedRoute onlyAuth><Profile /></ProtectedRoute>} />
          <Route path='orders' element={<ProtectedRoute onlyAuth><ProfileOrders /></ProtectedRoute>} />
          <Route path='orders/:number' element={<ProtectedRoute onlyAuth><OrderInfo /></ProtectedRoute>} />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route path='/feed/:number' element={<OrderInfoModal />} />
          <Route path='/ingredients/:id' element={<IngredientDetailsModal />} />
          <Route path='/profile/orders/:number' element={<OrderInfoModal />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
