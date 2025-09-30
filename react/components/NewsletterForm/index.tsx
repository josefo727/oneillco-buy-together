import React, { useState } from 'react';
import { NewsletterFormProps } from './typings';
import styles from './styles.css';

const NewsletterForm: StorefrontFunctionComponent<NewsletterFormProps> = ({ title, description, buttonText }) => {
  const [email, setEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    // Here you would typically handle the form submission, e.g., by calling a newsletter API.
    console.log('Submitted email:', email);
  };

  return (
    <div className={`${styles.newsletterFormContainer} ${styles.newsletterFormContainer}`}>
      <h1 className={`${styles.newsletterFormTitle} ${styles.newsletterFormTitle}`}>{title}</h1>
      <p className={`${styles.newsletterFormDescription} ${styles.newsletterFormDescription}`}>{description}</p>
      <div className={`${styles.newsletterForm} ${styles.newsletterForm}`}>
        <input
          type='email'
          placeholder='Correo electrónico'
          value={email}
          onChange={handleInputChange}
          className={`${styles.newsletterFormInput} ${styles.newsletterFormInput}`}
        />
        <button onClick={handleSubmit} className={`${styles.newsletterFormButton} ${styles.newsletterFormButton}`}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

NewsletterForm.schema = {
  title: 'Newsletter Form',
  description: 'A form for newsletter subscriptions.',
  type: 'object',
  properties: {
    title: {
      title: 'Title',
      type: 'string',
    },
    description: {
      title: 'Description',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
    buttonText: {
      title: 'Button Text',
      type: 'string',
    },
  },
};

export default NewsletterForm;
