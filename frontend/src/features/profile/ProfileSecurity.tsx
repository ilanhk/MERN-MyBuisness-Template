import { useEffect, useState } from "react";
import { useSelectAuth } from "../auth/state/hooks";
import { get2faQrCode } from "../../general/utils/2faApis";



const ProfileSecurity = () => {
  const [qr, setQr] = useState('');
  const [inEmailList, setInEmailList] = useState(true);
  const auth = useSelectAuth();

  useEffect(()=>{
    const getQrCode = async ()=>{
      const data = await get2faQrCode();
      console.log('qrcode data: ', data)
      setQr(data.qrCode);
      setInEmailList(data.user.inEmailList);
    };

    getQrCode();
  }, []);



  return (
    <div>
      <h3>Security and Data Privacy:</h3>
      <p>Want to set up Two Step Authentication?</p>
      <p>Scan the QR code:</p>
      <img className="qr-code-image" src={qr} />

      {auth.isEmployee ? (<></>) : (<p>Subscribe to our News Letter</p>)}
    </div>
  )
};

export default ProfileSecurity;