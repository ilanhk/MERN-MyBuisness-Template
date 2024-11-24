const getReduxStatus = (response: string)=>{
  const parts = response.split('/');
  return  parts[parts.length - 1];
};

export default getReduxStatus;