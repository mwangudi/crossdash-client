import { useSelector } from 'react-redux';

export const Hooks = () => {
  const auth = useSelector(state => state.auth);
  const { authUser } = auth;

  const checkRole = role => {
    return authUser.roles.includes(role);
  };

  return {
    checkRole,
  };
};

export default Hooks;
