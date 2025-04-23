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
import CompanyLogo from '../../../general/components/CompanyLogo';
import { navItemsForEditingExample } from '../../../general/utils/navItems';
import '../css/websiteStylesForms.css';


const EditHeaderFooterStylesForm = () => {
  const websiteStyles = useSelectWebsiteStyles();
  const updateWebsiteStylesHook = useUpdateWebsiteStyles();
  const status = useSelectWebsiteStylesStatus();

  console.log('webiste', websiteStyles);

  const { backgroundColor, fontSize, wordColor, dropdown } =
    websiteStyles.headerAndFooter;
  const { colors, fonts } = websiteStyles.saves;

  const [bgColor, setBgColor] = useState<string | null>(backgroundColor || '');
  const [wColor, setWColor] = useState<string | null>(wordColor || '');
  const [wSize, setWSize] = useState<string | null>(fontSize || '');

  const [dropDownBGColor, setDropDownBGColor] = useState<string | null>(
    dropdown.backgroundColor || ''
  );
  const [dropDownWColor, setDropDownWColor] = useState<string | null>(
    dropdown.wordColor || ''
  );
  const [dropDownHoverColor, setDropDownHoverColor] = useState<string | null>(
    dropdown.hoverColor || ''
  );

  const [colorList, setColorList] = useState<string[] | null>(colors || []);

  const [isError, setIsError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReset = () => {
    setBgColor('#d4d1d1');
    setWColor('#000000');
    setWSize('16px');
    setDropDownBGColor('#dddcdc');
    setDropDownWColor('#000000');
    setDropDownHoverColor('#aaa7a7');
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
      headerAndFooter: {
        backgroundColor: bgColor,
        fontSize: wSize,
        wordColor: wColor,
        dropdown: {
          backgroundColor: dropDownBGColor,
          wordColor: dropDownWColor,
          hoverColor: dropDownHoverColor,
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
        console.log('header/footer styles updated!');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating header/footer styles:', error.message);
        setIsError(error.message);
      } else {
        console.error('Unexpected error:', error);
        setIsError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="ws-form-container">
      <h3 className="ws-form-title">Update Header & Footer Styles:</h3>
      {!websiteStyles?.headerAndFooter ? (
        <div>Please go to Reset Webiste Styles</div>
      ) : (
        <form className="ws-form" onSubmit={submitHandler} noValidate>
          <div className="ws-form-input-with-example">
            <div
              className="ws-example"
              style={{
                backgroundColor: bgColor,
                fontSize: wSize,
                color: wColor,
              }}
            >
              <nav className="ws-example-navbar">
                <div className="logo-container">
                  <CompanyLogo />
                </div>
                <ul className="navbar-list">
                  {navItemsForEditingExample.map((item, index) => (
                    <li key={index} className="navbar-item">
                      {item.name}
                      {item.dropdown && (
                        <ul
                          className="dropdown-menu"
                          style={{
                            backgroundColor: dropDownBGColor,
                            color: dropDownWColor,
                          }}
                        >
                          {item.dropdown.map((dropdownItem, dropdownIndex) => (
                            <li key={dropdownIndex} className="dropdown-item">
                              {dropdownItem.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                  <li className="user-button">
                    <CIFormButton text="Login" color="primary" />
                  </li>
                </ul>
              </nav>
            </div>
            <div className="ws-form-input">
              <div className="ws-color-input-form">
                <label htmlFor="bgColor" className="ws-label">
                  Header/Footer BackGround Color:
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
                  Header/Footer Word Color:
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
              <div className="ws-size-input">
                <label htmlFor="wordSize">Header/Footer Word Size:</label>
                <input
                  type="number"
                  step="any"
                  value={wSize?.replace('px', '') || ''}
                  onChange={(e) => setWSize(`${e.target.value}px`)}
                />
              </div>
              <div className="ws-color-input-form">
                <label htmlFor="dropdownBgColor" className="ws-label">
                  Dropdown BackGround Color:
                </label>
                <input
                  type="color"
                  id="dropdownBgColor"
                  value={dropDownBGColor}
                  onChange={(e) => setDropDownBGColor(e.target.value)}
                />
                <SaveButton onClick={() => handleSave(dropDownBGColor)} />
                <p>or</p>
                <select
                  id="dropdownbgcolorlist"
                  value={bgColor}
                  onChange={(e) => setDropDownBGColor(e.target.value)}
                  style={{ width: '100px', backgroundColor: dropDownBGColor }} // Set dropdown width here
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
                <label htmlFor="dropdownWColor" className="ws-label">
                  Dropdown Word Color:
                </label>
                <input
                  type="color"
                  id="dropdownWColorchoose"
                  value={dropDownWColor}
                  onChange={(e) => setDropDownWColor(e.target.value)}
                />
                <SaveButton onClick={() => handleSave(dropDownWColor)} />
                <p>or</p>
                <select
                  id="colorlist"
                  value={dropDownWColor}
                  onChange={(e) => setDropDownWColor(e.target.value)}
                  style={{ width: '100px', backgroundColor: dropDownWColor }}
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
                <label htmlFor="dropDownHoverColor" className="ws-label">
                  Dropdown Hover Color:
                </label>
                <input
                  type="color"
                  id="bgcolorchoose"
                  value={dropDownHoverColor}
                  onChange={(e) => setDropDownHoverColor(e.target.value)}
                />
                <SaveButton onClick={() => handleSave(dropDownHoverColor)} />
                <p>or</p>
                <select
                  id="dropDownHoverColorList"
                  value={dropDownHoverColor}
                  onChange={(e) => setDropDownHoverColor(e.target.value)}
                  style={{
                    width: '100px',
                    backgroundColor: dropDownHoverColor,
                  }}
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
              <FormMessage
                message="Header/Footer Styles Updated!"
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

export default EditHeaderFooterStylesForm;
