// @flow

import React from 'react';
import styles from './Company.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Image from 'app/components/Image';
import InfoBubble from 'app/components/InfoBubble';
import { Link } from 'react-router';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';

type Props = {
  company: Object
};

function insertInfoBubbles(company) {
  const infos = [
    ['phone', company.phone],
    ['home', company.website],
    ['twitter', company.twitter],
    ['facebook', company.facebook],
    ['github', company.github]
  ];

  return (
    <div className={styles.infoBubbles}>
      {infos.map((info, i) => (
        <InfoBubble
          key={info[0]}
          icon={info[0]}
          data={info[1]}
          style={{ order: i }}
          link={info[1] && info[1].includes('.') ? info[1] : undefined}
          small
          iconClass={styles.icon}
          dataClass={styles.data}
        />
      ))}
    </div>
  );
}

const CompanyDetail = ({ company }: Props) => {
  if (!company) {
    return <LoadingIndicator loading />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.coverImage}>
        <Image src={company.logo} className={styles.image} />
      </div>

      <div className={styles.titleFlex}>
        <h1 className={styles.title} style={{ order: 1 }}>
          {company.name}
        </h1>
        <Link
          to={'/companies'}
          className={styles.editLink}
          style={{ order: 2 }}
        >
          <Button>
            <Icon name="pencil" />
            Endre
          </Button>
        </Link>
      </div>

      {insertInfoBubbles(company)}

      <div className={styles.description}>
        <p>{company.description}</p>
      </div>
    </div>
  );
};

export default CompanyDetail;
