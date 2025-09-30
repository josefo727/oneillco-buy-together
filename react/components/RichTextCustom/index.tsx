import React from 'react';
import { index as RichText } from 'vtex.rich-text'
import styles from './styles.css'
import { RichTextCustomProps } from './typings';


const RichTextCustom: StorefrontFunctionComponent<RichTextCustomProps> = ({ text }) => {

  return (
    <div className={`${styles.richTextCustomContainer}`}>
      <RichText text={text} />
    </div>
  );
};

RichTextCustom.schema = {
  title: 'Rich Text Custom',
  description: 'A custom rich text component.',
  type: 'object',
  properties: {
    text: {
      title: 'Text',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
      default: 'Lorem ipsum dolor sit amet, consectetur adipiscing ( Publlic Sans, light, 16px )'
    },
  },
};

export default RichTextCustom;
