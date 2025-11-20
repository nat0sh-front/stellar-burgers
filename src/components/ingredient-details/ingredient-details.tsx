import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../modal';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const ingredients = useSelector(getIngredients);
  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};

export const IngredientDetailsModal: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  return (
    <Modal
      title={'Детали ингредиента'}
      onClose={() => {
        if (background) {
          navigate(-1);
        } else {
          navigate('/');
        }
      }}
    >
      <IngredientDetails />
    </Modal>
  );
};
