import React from 'react';
import styles from './styles.css';

interface ImageSummaryProps {
  imageUrls: string[];
}

const ImageSummary: StorefrontFunctionComponent<ImageSummaryProps> = ({ imageUrls }) => {
  if (!imageUrls || imageUrls.length === 0) {
    return null;
  }

  const renderImages = () => {
    switch (imageUrls.length) {
      case 1:
        return (
          <div className={styles['image-summary-container-1']}>
            <img src={imageUrls[0]} alt="Product 1" className={styles['image-1']} />
          </div>
        );
      case 2:
        return (
          <div className={styles['image-summary-container-2']}>
            <img src={imageUrls[0]} alt="Product 1" className={styles['image-2-1']} />
            <img src={imageUrls[1]} alt="Product 2" className={styles['image-2-2']} />
          </div>
        );
      case 3:
        return (
          <div className={styles['image-summary-container-3']}>
            <img src={imageUrls[0]} alt="Product 1" className={styles['image-3-1']} />
            <img src={imageUrls[1]} alt="Product 2" className={styles['image-3-2']} />
            <img src={imageUrls[2]} alt="Product 3" className={styles['image-3-3']} />
          </div>
        );
      case 4:
        return (
          <div className={styles['image-summary-container-4']}>
            <img src={imageUrls[0]} alt="Product 1" className={styles['image-4-1']} />
            <img src={imageUrls[1]} alt="Product 2" className={styles['image-4-2']} />
            <img src={imageUrls[2]} alt="Product 3" className={styles['image-4-3']} />
            <img src={imageUrls[3]} alt="Product 4" className={styles['image-4-4']} />
          </div>
        );
      default:
        // Handle more than 4 images or other cases
        return (
          <div className={styles['image-summary-container-default']}>
            {imageUrls.map((url, index) => (
              <img key={index} src={url} alt={`Product ${index + 1}`} className={styles['image-default']} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className={styles['image-summary']}>
      {renderImages()}
    </div>
  );
};

ImageSummary.schema = {
  title: 'Image Summary',
  description: 'Displays a summary of product images in various layouts.',
  type: 'object',
  properties: {
    imageUrls: {
      title: 'Image URLs',
      type: 'array',
      items: {
        title: 'Image URL',
        type: 'string',
      },
    },
  },
};

export default ImageSummary;
