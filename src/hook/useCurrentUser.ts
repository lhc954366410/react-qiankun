import { userContext } from '@/layouts/SecurityLayout';
import {  useRef,useContext } from 'react';


const useCurrentUser = () => {
  // const currentUser = useRef(JSON.parse(localStorage.getItem("currentUser")||"{}"))
  const {currentUser} = useContext(userContext)
 
  return currentUser;
};

export default useCurrentUser;
