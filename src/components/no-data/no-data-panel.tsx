type TNoDataProps = {
  className?: string;
};
export const NoDataPanel = ({ className }: TNoDataProps) => {
  return <div className={`root ${className ?? ''} text text_type_main-default`}>Нет данных для отображения</div>;
};
