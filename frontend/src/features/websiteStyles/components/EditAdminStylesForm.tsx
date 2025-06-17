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
import SaveButton from './SaveButton';
import '../css/websiteStylesForms.css';

const EditAdminStylesForm = () => {
  const websiteStyles = useSelectWebsiteStyles();
  const updateWebsiteStylesHook = useUpdateWebsiteStyles();
  const status = useSelectWebsiteStylesStatus();

  const { backgroundColor, wordColor, sideBar } = websiteStyles.admin;
  const { colors, fonts } = websiteStyles.saves;

  const [bgColor, setBgColor] = useState<string | null>(backgroundColor || '');
  const [wColor, setWColor] = useState<string | null>(wordColor || '');
  const [sideBarBGColor, setSideBarBGColor] = useState<string | null>(
    sideBar.backgroundColor || ''
  );
  const [sideBarWColor, setsideBarWColor] = useState<string | null>(
    sideBar.wordColor || ''
  );

  const [colorList, setColorList] = useState<string[] | null>(colors || []);

  const [isError, setIsError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = () => {
    setBgColor('#ffffff');
    setWColor('#0f0f75');
    setSideBarBGColor('#0AB7DA');
    setsideBarWColor('#000000');
  };

  const handleSave = async (savedValue: string | null) => {
    if (colorList.includes(savedValue)) return;

    const updatedList = [...colorList, savedValue];
    setColorList(updatedList);

    const dataToUpdate = {
      saves: {
        colors: updatedList,
        fonts: fonts,
      },
    };

    try {
      await updateWebsiteStylesHook(websiteStyles?._id, dataToUpdate);
      console.log(`${savedValue} saved to DB!`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error saving ${savedValue}:`, error.message);
        setIsError(error.message);
      } else {
        console.error(`Unexpected error saving ${savedValue}:`, error);
        setIsError('An unexpected error occurred.');
      }
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToUpdate = {
      admin: {
        backgroundColor: bgColor,
        wordColor: wColor,
        sideBar: {
          backgroundColor: sideBarBGColor,
          wordColor: sideBarWColor,
        },
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
        console.log('admin styles updated!');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating admin styles:', error.message);
        setIsError(error.message);
      } else {
        console.error('Unexpected error:', error);
        setIsError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="ws-form-container">
      <h3 className="ws-form-title">Update Admin Styles:</h3>
      {!websiteStyles?.admin ? (
        <div>Please go to Reset Webiste Styles</div>
      ) : (
        <form className="ws-form" onSubmit={submitHandler} noValidate>
          <div className="ws-form-input-with-example-sidebar">
            <div
              className="ws-example"
              style={{
                backgroundColor: sideBarBGColor,
                color: sideBarWColor,
                width: '9rem',
              }}
            >
              <h2
                className="ws-example-title"
                style={{
                  marginTop: '4px',
                  marginBottom: '4px',
                }}
              >
                SideBarTitle
              </h2>
              <p className="ws-example-words" style={{ fontWeight: 'bold' }}>
                sidebar option
              </p>
            </div>
            <div
              className="ws-form-input"
              style={{ backgroundColor: bgColor, color: wColor }}
            >
              <div className="ws-color-input-form">
                <label htmlFor="bgColor" className="ws-label">
                  Admin BackGround Color:
                </label>
                <input
                  type="color"
                  id="bgcolorchoose"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <SaveButton onClick={() => handleSave(bgColor)} />
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
                  Admin Word Color:
                </label>
                <input
                  type="color"
                  id="bgcolorchoose"
                  value={wColor}
                  onChange={(e) => setWColor(e.target.value)}
                />
                <SaveButton onClick={() => handleSave(wColor)} />
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
              <div className="ws-color-input-form">
                <label htmlFor="bgColor" className="ws-label">
                  Admin Sidebar BackGround Color:
                </label>
                <input
                  type="color"
                  id="sideBarBGColorchoose"
                  value={sideBarBGColor}
                  onChange={(e) => setSideBarBGColor(e.target.value)}
                />
                <SaveButton onClick={() => handleSave(sideBarBGColor)} />
                <p>or</p>
                <select
                  id="sbbgcolorlist"
                  value={sideBarBGColor}
                  onChange={(e) => setSideBarBGColor(e.target.value)}
                  style={{ width: '100px', backgroundColor: sideBarBGColor }} 
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
                <label htmlFor="sideBarWColor" className="ws-label">
                  Admin Sidebar Word Color:
                </label>
                <input
                  type="color"
                  id="sideBarWColorchoose"
                  value={sideBarWColor}
                  onChange={(e) => setsideBarWColor(e.target.value)}
                />
                <SaveButton onClick={() => handleSave(sideBarWColor)} />
                <p>or</p>
                <select
                  id="sbwordcolorlist"
                  value={wColor}
                  onChange={(e) => setsideBarWColor(e.target.value)}
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
              <FormMessage message="Admin Styles Updated!" level="success" />
            )}
            {status === EnumStatus.Loading && <Loader size="small" />}
          </div>
        </form>
      )}
    </div>
  );
};

export default EditAdminStylesForm;
