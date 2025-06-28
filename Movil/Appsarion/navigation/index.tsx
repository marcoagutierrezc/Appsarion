import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import Main from './MainStack';
import Auth from './AuthStack';
import Loading from '../utils/FishLoadingScreen';
import { RootState } from '../store';

const Navigation: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const renderContent = () => {
    if (isAuthenticated === null) return <Loading />;
    if (isAuthenticated === false) return <Auth />;
    return <Main />;
  };

  return (
    <NavigationContainer>
      {renderContent()}
    </NavigationContainer>
  );
};

export default Navigation;
