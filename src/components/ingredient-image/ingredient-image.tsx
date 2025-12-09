import styles from './ingredient-image.module.css';

type TIngredientImageProps = {
  src: string;
};

export const IngredientImage = ({ src }: TIngredientImageProps): React.ReactElement => {
  return (
    <div className={styles.card_ingredient}>
      <img className={styles.card_ingredient_image} src={src} alt="ингредиент" />
    </div>
  );
};
