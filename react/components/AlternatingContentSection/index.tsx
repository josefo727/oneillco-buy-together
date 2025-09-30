import React from 'react';
import styles from './styles.css'
import {infoItemsProps, ProductsList} from './typings';
import { index as RichText } from 'vtex.rich-text'


const AlternatingContentSection: StorefrontFunctionComponent<infoItemsProps> = ({infoItems}) => {

  return (
    <div className={styles['container-beauty-catalog']}>
      {infoItems?.map((product: ProductsList, index: number) => (
        <div
          key={index}
          className={`${styles['content-beauty-catalog']} ${index % 2 !== 0 ? styles['reverse'] : ''}`}
        >
          <div className={styles['info-beauty-catalog-image']}>
            <img src={product.image} alt={product.imageAlt}/>
          </div>
          <div className={styles['info-beauty-catalog']}>
            <div className={styles['titles-beauty-catalog']}>
              <h2>{product.subtitle}</h2>
              <h3>{product.outstanding}</h3>
            </div>
            <RichText text={product.details} />
          </div>
        </div>
      ))}
    </div>
  );
}

AlternatingContentSection.schema = {
  title: 'Alternating Content Section',
  description: 'Component that displays alternating content sections with image and text',
  type: 'object',
  properties: {
    infoItems: {
      title: 'Content Items',
      description: 'Array of content items to display in alternating layout',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          subtitle: {
            title: 'Subtitle (H2)',
            description: 'Main subtitle for the content section',
            type: 'string',
            default: ''
          },
          outstanding: {
            title: 'Outstanding Text (H3)',
            description: 'Highlighted or outstanding text',
            type: 'string',
            default: ''
          },
          details: {
            title: 'Details Text',
            description: 'Detailed description or paragraph content. Use \\n for line breaks.',
            type: 'string',
            widget: {
              'ui:widget': 'textarea'
            },
            default: ''
          },
          image: {
            title: 'Image URL',
            description: 'URL or path to the image',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
            default: ''
          },
          imageAlt: {
            title: 'Image Alt Text',
            description: 'Alternative text for the image (accessibility)',
            type: 'string',
            default: ''
          }
        },
        required: ['subtitle', 'outstanding', 'details', 'image', 'imageAlt']
      },
      default: [
        {
          subtitle: 'Your Subtitle Here',
          outstanding: 'Outstanding Feature',
          details: 'Add your detailed description here. Use \\n for line breaks if needed.',
          image: '',
          imageAlt: 'Descriptive alt text'
        }
      ]
    }
  }
};

export default AlternatingContentSection;
