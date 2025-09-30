import React from 'react';
import { HeroBannerProps } from './typings';
import styles from './styles.css';


const HeroBanner: StorefrontFunctionComponent<HeroBannerProps> = ({
  desktopImage,
  mobileImage,
  color ,
  title,
  subtitle,
  highlight,
}) => {

  return (
    <div className={styles.heroBannerContainer}>
      <img src={desktopImage} alt={title} className={`${styles.heroBannerImage} ${styles.desktop}`} />
      <img src={mobileImage} alt={title} className={`${styles.heroBannerImage} ${styles.mobile}`} />
      <div className={styles.heroBannerContent}>
        <h1 className={styles.heroBannerTitle} style={{color: color }}>{title}</h1>
        <h2 className={styles.heroBannerSubtitle} style={{color: color }}>{subtitle}</h2>
        <h3 className={styles.heroBannerHighlight} style={{color: color }}>{highlight}</h3>
      </div>
    </div>
  );
};

HeroBanner.schema = {
  title: 'Hero Banner',
  description: 'A banner with a title, subtitle, and highlight.',
  type: 'object',
  properties: {
    desktopImage: {
      title: 'Desktop Image',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    mobileImage: {
      title: 'Mobile Image',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    color: {
      title: 'Color Titles',
      type: 'string',
      default: '#000000',
      description: 'Ej: #000000'
    },
    title: {
      title: 'Title',
      type: 'string',
      default: 'H1 - Titulo blog - ( Merriweather, Light Itallic, 36px )'
    },
    subtitle: {
      title: 'Subtitle',
      type: 'string',
      default: 'H2 - subtitulo - ( Merriweather, Light Itallic, 32px )'
    },
    highlight: {
      title: 'Highlight',
      type: 'string',
      default: 'H3 - destacado - ( Merriweather, Light Itallic, 26px )'
    }
  },
};

export default HeroBanner;
