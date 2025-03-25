import fs from 'fs';
import path from 'path';
import { IWebsiteStyles } from '../models/websiteStylesModel';
const cssFilePath = path.join(__dirname, '../../../frontend/src/general/css/globalVariables.css');

// Function to update CSS file with new variables
export const updateCSSFile = async (styles) => {
  const {general, headerAndFooter, admin,} = styles;
  const cssContent = `:root {
  --general-background-color: ${general.backgroundColor};
  --general-font: ${general.font};
  --general-word-color: ${general.wordColor};
  --general-font-size: ${general.wordSize};
  --general-title-font-size: ${general.titleSize};

  --header-footer-background-color: ${headerAndFooter.backgroundColor};
  --header-footer-font-size: ${headerAndFooter.fontSize};
  --header-footer-word-color: ${headerAndFooter.wordColor};
  --header-footer-dropdown-background-color: ${headerAndFooter.dropdown.backgroundColor};
  --header-footer-dropdown-word-color: ${headerAndFooter.dropdown.wordColor};
  --header-footer-dropdown-hover-color: ${headerAndFooter.dropdown.hoverColor};

  --admin-background-color: ${admin.backgroundColor};
  --admin-word-color: ${admin.wordColor};
  --admin-sidebar-background-color: ${admin.sideBar.backgroundColor};
  --admin-sidebar-word-color: ${admin.sideBar.wordColor};
  }`;

  fs.writeFileSync(cssFilePath, cssContent, 'utf8');
};

