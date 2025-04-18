import { useState } from 'react';
import {
  useSelectWebsiteStyles,
  useSelectWebsiteStylesStatus,
  useUpdateWebsiteStyles,
} from '../state/hooks';
import { EnumStatus } from '../state/slice';
import CIFormButton from '../../company/companyInfo/components/CIFormButton';
import FormMessage from '../../../general/components/FormMessage';
import Loader from '../../../general/components/Loader';
import '../css/websiteStylesForms.css';

const EditGeneralStylesForm = () => {
  const websiteStyles = useSelectWebsiteStyles();
  const updateWebsiteStylesHook = useUpdateWebsiteStyles();
  const status = useSelectWebsiteStylesStatus();

  const { backgroundColor, font, wordColor, wordSize, titleSize } =
    websiteStyles.general;
  const { colors, fonts } = websiteStyles.saves;

  const [bgColor, setBgColor] = useState<string | null>(backgroundColor || '');
  const [fontFamily, setFontFamily] = useState<string | null>(font || '');
  const [wColor, setWColor] = useState<string | null>(wordColor || '');
  const [wSize, setWSize] = useState<string | null>(wordSize || '');
  const [tSize, setTSize] = useState<string | null>(titleSize || '');

  const [colorList, setColorList] = useState<string[] | null>(colors || []);
  const [fontList, setFontList] = useState<string[] | null>(fonts || []);

  const [isError, setIsError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToUpdate = {
      general: {
        backgroundColor: bgColor,
        font: fontFamily,
        wordColor: wColor,
        wordSize: wSize,
        titleSize: tSize,
      },
      saves: {
        colors: colorList,
        fonts: fontList,
      },
    };

    try {
      setIsSuccess(false);

      console.log('datatoupdate', dataToUpdate);

      const update = await updateWebsiteStylesHook(
        websiteStyles?._id,
        dataToUpdate
      );

      if (status === EnumStatus.Fail) {
        throw new Error('This is not working');
      }

      if (status === EnumStatus.Success) {
        setIsSuccess(true);
        console.log('Company info updated!');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating company info:', error.message);
        setIsError(error.message);
      } else {
        console.error('Unexpected error:', error);
        setIsError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="ws-form-container">
      <h3 className="ws-form-title">Update General Styles:</h3>
      {!websiteStyles?.general ? (
        <div>Please go to Reset Webiste Styles</div>
      ) : (
        <form className="ws-form" onSubmit={submitHandler} noValidate>
          <div className="ws-form-input-with-example">
            <div className="ws-example" style={{ backgroundColor: bgColor, fontFamily: fontFamily, color: wColor }}>
              <h4 className="ws-example-title" style={{ fontSize: tSize}}>Title</h4>
              <p className="ws-example-words" style={{ fontSize: wSize}}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
                vel velit dolores, accusamus dolor ratione consectetur ad
                eligendi, amet beatae est doloremque debitis. Vel praesentium,
                commodi reiciendis qui ab non!
              </p>
            </div>
            <div className="ws-form-input">
              <div className="ws-color-input-form">
                <label htmlFor="companyName" className="ci-label">
                  BackGround Color:
                </label>
                <input
                  type="color"
                  id="bgcolorchoose"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <p>or</p>
                <select
                  id="bgcolorlist"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                >
                  {colorList.map((color) => (
                    <option key={color} value={color}>
                      <div>{color}</div>
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="ws-button-and-message-section">
            <CIFormButton text="Edit" color="primary" />
            {status === EnumStatus.Fail && (
              <FormMessage message={isError} level="error" />
            )}
            {isSuccess && (
              <FormMessage
                message="Name, Logo and Company Type Updated!"
                level="success"
              />
            )}
            {status === EnumStatus.Loading && <Loader size="small" />}
          </div>
        </form>
      )}
    </div>
  );
};

export default EditGeneralStylesForm;
