import { useState } from 'react';
import FontPicker from 'font-picker-react';
import {
  useSelectWebsiteStyles,
  useSelectWebsiteStylesStatus,
  useUpdateWebsiteStyles,
} from '../state/hooks';
import { EnumStatus } from '../state/slice';
import CIFormButton from '../../company/companyInfo/components/CIFormButton';
import FormMessage from '../../../general/components/FormMessage';
import Loader from '../../../general/components/Loader';
import SaveButton from './SaveButton';
import '../css/websiteStylesForms.css';

const googleFontsApiKey = import.meta.env.VITE_GOOGLE_FONTS_API_KEY;

const EditGeneralStylesForm = () => {
  const websiteStyles = useSelectWebsiteStyles();
  const updateWebsiteStylesHook = useUpdateWebsiteStyles();
  const status = useSelectWebsiteStylesStatus();

  console.log('webiste', websiteStyles);

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

  const handleReset = () => {
    setBgColor('#ffffff');
    setFontFamily("'Serif', sans-serif");
    setWColor('#0f0f75');
    setWSize('16px');
    setTSize('48px');
  };

  const handleSave = async (
    savedValue: string | null,
    savedType: 'color' | 'font'
  ) => {
    if (!savedValue) return;

    const isColor = savedType === 'color';
    const list = isColor ? colorList : fontList;

    if (list.includes(savedValue)) return;

    const updatedList = [...list, savedValue];
    if (isColor) {
      setColorList(updatedList);
    } else {
      setFontList(updatedList);
    }

    const dataToUpdate = {
      saves: {
        colors: isColor ? updatedList : colorList,
        fonts: !isColor ? updatedList : fontList,
      },
    };

    console.log('website styles id: ', websiteStyles?._id);

    try {
      await updateWebsiteStylesHook(websiteStyles?._id, dataToUpdate);
      console.log(`${savedType} saved to DB!`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error saving ${savedType}:`, error.message);
        setIsError(error.message);
      } else {
        console.error(`Unexpected error saving ${savedType}:`, error);
        setIsError('An unexpected error occurred.');
      }
    }
  };

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

      await updateWebsiteStylesHook(websiteStyles?._id, dataToUpdate);

      if (status === EnumStatus.Fail) {
        throw new Error('This is not working');
      }

      if (status === EnumStatus.Success) {
        setIsSuccess(true);
        console.log('general website styles updated!');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating general website styles:', error.message);
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
            <div
              className="ws-example"
              style={{
                backgroundColor: bgColor,
                fontFamily: fontFamily,
                color: wColor,
              }}
            >
              <h4
                className="ws-example-title"
                style={{
                  fontSize: tSize,
                  marginTop: '4px',
                  marginBottom: '4px',
                }}
              >
                Title
              </h4>
              <p className="ws-example-words" style={{ fontSize: wSize }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
                vel velit dolores, accusamus dolor ratione consectetur ad
                eligendi, amet beatae est doloremque debitis. Vel praesentium,
                commodi reiciendis qui ab non!
              </p>
            </div>
            <div className="ws-form-input">
              <div className="ws-color-input-form">
                <label htmlFor="bgColor" className="ws-label">
                  BackGround Color:
                </label>
                <input
                  type="color"
                  id="bgcolorchoose"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <SaveButton onClick={() => handleSave(bgColor, 'color')} />
                <p>or</p>
                <select
                  id="bgcolorlist"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ width: '100px', backgroundColor: bgColor }} // Set dropdown width here
                >
                  {colorList.map((color) => (
                    <option
                      key={color}
                      value={color}
                      style={{ backgroundColor: color }}
                    >
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ws-color-input-form">
                <label htmlFor="wColor" className="ws-label">
                  Word Color:
                </label>
                <input
                  type="color"
                  id="bgcolorchoose"
                  value={wColor}
                  onChange={(e) => setWColor(e.target.value)}
                />
                <SaveButton onClick={() => handleSave(wColor, 'color')} />
                <p>or</p>
                <select
                  id="wordcolorlist"
                  value={wColor}
                  onChange={(e) => setWColor(e.target.value)}
                  style={{ width: '100px', backgroundColor: wColor }} // Set dropdown width here
                >
                  {colorList.map((color) => (
                    <option
                      key={color}
                      value={color}
                      style={{ backgroundColor: color }}
                    >
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ws-font-input-form">
                <label htmlFor="companyName" className="ci-label">
                  Font:
                </label>
                <FontPicker
                  apiKey={googleFontsApiKey}
                  activeFontFamily={fontFamily}
                  onChange={(nextFont) => setFontFamily(nextFont.family)}
                />
                <SaveButton onClick={() => handleSave(fontFamily, 'font')} />
                <p>or</p>
                <select
                  id="fontlist"
                  value={fontFamily}
                  onChange={(e) => setWColor(e.target.value)}
                >
                  {fontList.map((font) => (
                    <option key={font} value={font}>
                      <div>{font}</div>
                    </option>
                  ))}
                </select>
              </div>
              <div className="ws-size-input">
                <label htmlFor="titleSize">Title Size:</label>
                <input
                  type="number"
                  step="any"
                  value={tSize?.replace('px', '') || ''}
                  onChange={(e) => setTSize(`${e.target.value}px`)}
                />
              </div>
              <div className="ws-size-input">
                <label htmlFor="wordSize">Word Size:</label>
                <input
                  type="number"
                  step="any"
                  value={wSize?.replace('px', '') || ''}
                  onChange={(e) => setWSize(`${e.target.value}px`)}
                />
              </div>
            </div>
          </div>

          <div className="ws-button-and-message-section">
            <div className="ws-form-buttons">
              <CIFormButton text="Edit" color="primary" />
              <CIFormButton
                text="Reset"
                color="success"
                onClick={handleReset}
              />
            </div>
            {status === EnumStatus.Fail && (
              <FormMessage message={isError} level="error" />
            )}
            {isSuccess && (
              <FormMessage message="General Styles Updated!" level="success" />
            )}
            {status === EnumStatus.Loading && <Loader size="small" />}
          </div>
        </form>
      )}
    </div>
  );
};

export default EditGeneralStylesForm;
