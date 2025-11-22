import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type { JSX } from 'react';
import type React from 'react';

type ProtectedRouteProps = {
  isAllowed: boolean;
  isReady: boolean;

  redirectPath: string;

  fallback?: React.ReactNode;
  children?: React.ReactNode;
};

export const ProtectedRouteElement = (props: ProtectedRouteProps): JSX.Element => {
  const { isAllowed, isReady, redirectPath, children, fallback } = props;
  const location = useLocation();

  if (!isReady)
    return (
      <>
        {fallback ?? (
          <p className="text text_type_main-default text_color_inactive mt-20 ml-20">Пожалуйста, подождите..</p>
        )}
      </>
    );

  if (!isAllowed) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return <>{children ?? <Outlet />}</>;
};
