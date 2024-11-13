import { useEffect, useState } from "react";
import { useGetUserProfile, useUpdateProfile } from "./state/hooks";
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { get2faQrCode } from "../../general/utils/2faApis";




const ProfileSecurity = () => {
  const [twoFA, setTwoFA] = useState(false);
  const [qr, setQr] = useState('');
  const getUserProfileHook = useGetUserProfile();
  const updateUserProfileHook = useUpdateProfile();

  let profile;

  useEffect(()=>{
    const getProfileData = async ()=>{
      profile = await getUserProfileHook();
      if(profile.payload.twoFaSecret){
        setTwoFA(true);
        console.log(profile.payload)
      } else{
        setTwoFA(false);
      };
    };

    getProfileData();
  }, []);

  const handleGetResetTwoFA = async ()=>{
    const data = await get2faQrCode();
      console.log('qrcode data: ', data)
      setQr(data.qrCode);
      setTwoFA(true);
  };

  const handleRemoveTwoFA = async ()=>{
    await updateUserProfileHook({ twoFaSecret: null});
    setQr('');
    setTwoFA(false);
  };

  return (
    <div>
      <h3>Security and Data Privacy:</h3>
      
      <p>Want to set up Two Step Authentication? </p>
      <Button 
        variant="contained" 
        size="large"
        onClick={handleGetResetTwoFA}
        >
          Get/Reset 2FA QR Code
      </Button>

      { twoFA && 
      <Button 
        variant="contained"
        color="error" 
        className="remove-twofa-button"
        startIcon={<DeleteIcon />}
        onClick={handleRemoveTwoFA}
      >
        Remove 2FA
      </Button>
      }

      {twoFA && (
      <div>
        <p>Scan the QR code:</p>
        <img className="qr-code-image" src={qr} />
      </div>
      )}
      
    </div>
  )
};

export default ProfileSecurity;