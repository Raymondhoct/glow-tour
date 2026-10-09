import React from 'react';
import { useLang } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
const Footer = () => {
const { t } = useLang();
return (
<footer style={footerStyle}>
<div style={containerStyle}>
<div style={colStyle}>
<h4 style={titleStyle}>✈️ {t('siteName')}</h4>
<p style={textStyle}>{t('footerDesc')}</p>
</div>
<div style={colStyle}>
<h4 style={titleStyle}>{t('quickLink')}</h4>
<div style={linkWrap}>
<Link to="/home" style={footerLink}>{t('footerHome')}</Link>
<Link to="/browse" style={footerLink}>{t('footerTours')}</Link>
<Link to="/my-records" style={footerLink}>{t('footerRecords')}</Link>
</div>
</div>
<div style={colStyle}>
<h4 style={titleStyle}>{t('contact')}</h4>
<p style={textStyle}>support@glow-shadow.com</p>
</div>
</div>
<div style={copyrightStyle}>
        ©2026 {t('siteName')}. All rights reserved.
</div>
</footer>
  );
};
const footerStyle = {
background: '#0F2848',
color: '#cbd5e1',
padding: '40px 16px 20px'
};
const containerStyle = {
maxWidth: '1200px',
margin: '0 auto',
display: 'flex',
flexWrap: 'wrap',
gap: '32px',
justifyContent: 'space-around'
};
const colStyle = {
minWidth: '180px'
};
const titleStyle = {
color: '#fff',
marginTop: 0,
marginBottom: '12px'
};
const textStyle = {
lineHeight: 1.6,
fontSize: '14px'
};
const linkWrap = {
display: 'flex',
flexDirection: 'column',
gap: '8px'
};
const footerLink = {
color: '#cbd5e1',
textDecoration: 'none',
fontSize: '14px'
};
const copyrightStyle = {
textAlign: 'center',
marginTop: '32px',
paddingTop: '16px',
borderTop: '1px solid #273b58',
fontSize: '13px'
};
export default Footer;
