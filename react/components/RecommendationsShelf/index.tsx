import React from 'react';
import { RecommendationsShelfProps } from './typings';
import styles from './styles.css';


const RecommendationsShelf: StorefrontFunctionComponent<RecommendationsShelfProps> = ({ title }) => {

  return (
    <div className={`${styles.recommendationsShelfContainer}`}>
      <h3 className={styles.recommendationsShelfTitle}>{title}</h3>
    </div>
  );
};

RecommendationsShelf.schema = {
  title: 'Recommendations Shelf',
  description: 'A shelf for product recommendations.',
  type: 'object',
  properties: {
    title: {
      title: 'Shelf Title',
      type: 'string',
      default: 'También te puede interesar'
    },
  },
};

export default RecommendationsShelf;
