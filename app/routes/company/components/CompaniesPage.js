// @flow

import React from 'react';
import styles from './Company.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import {Link} from 'react-router';
import {Image} from 'app/components/Image';
import type {Company}
from 'app/models';
import {Button} from 'app/components/Form';

type Props = {
    companies: Array<Company>,
    showFetchMore: () => void,
    fetchMore: () => void,
};

const CompanyItem = function({company} : any) {
    let websiteString = company.website.split('/');
    websiteString = websiteString[0] + '//' + websiteString[2];


    return <div className={styles.companyItem}>
        <div className={styles.companyItemContent}>
            <Link to={`/companies/${company.id}`}>
                <div className={styles.companyLogo}>
                    {<Image src='https://www.freelogodesign.org/Content/img/slide-logo-1.png'/>}
                </div>
                <div className={styles.companyItemTitle}>
                    <h2>{company.name}</h2>
                </div>
                <div className={styles.companyInfo}>
                    <span>{company.joblistingCount > 0 && company.joblistingCount + ' jobbannonser'}</span>
                    <span>{company.eventCount > 0 && company.eventCount + ' kommende arrangementer'}</span>
                </div>
            </Link>
            {
                (company.website && company.website != "http://example.com/") && (<a href={company.website}>
                    <div className={styles.website}>{websiteString}</div>
                </a>)
            }
        </div>
    </div>
}

type CompanyListProps = {
    name: string,
    companies: Array<Company>
};

const CompanyList = ({
    name,
    companies = []
} : CompanyListProps) => (<div className={styles.companyList}>
    {companies.map((company, id) => <CompanyItem key={id} company={company}/>)}
</div>);


const CompaniesPage = (props : Props) => (<div className={styles.root}>
    {props.companies.length === 0 && <LoadingIndicator loading />}
    <h2 className={styles.heading}>Bedrifter</h2>
    <CompanyList companies={props.companies}/>
    {props.showFetchMore && (<Button onClick={() => props.fetchMore()}>Flere bedrifter</Button>)}
</div>);

export default CompaniesPage;
