import React from 'react';
import { TitleComponentProps } from './typings';
import styles from './styles.css';


const TitleComponent: StorefrontFunctionComponent<TitleComponentProps> = ({
  color ,
  title,
  subtitle,
  highlight,
}) => {

  return (
    <div className={styles.TitleComponentContainer}>
      {title ? <h1 className={styles.Title} style={{color: color}}>{title}</h1> : ''}
      {subtitle ? <h2 className={styles.Subtitle} style={{color: color}}>{subtitle}</h2> : ''}
      {highlight ? <h3 className={styles.Highlight} style={{color: color}}>{highlight}</h3> : ''}
    </div>
  );
};

TitleComponent.schema = {
  title: 'Titles',
  description: 'A banner with a title, subtitle, and highlight.',
  type: 'object',
  properties: {
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

export default TitleComponent;
