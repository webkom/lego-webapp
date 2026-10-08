import { Card, Flex } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useMemo, useState } from 'react';
import { SelectInput } from '~/components/Form';
import { Tag } from '~/components/Tags';
import { sortSemesterChronologically } from '~/pages/bdb/company-interest/utils';
import { semesterToHumanReadable } from '~/pages/bdb/utils';
import { fetchEventStatistics } from '~/redux/actions/CompanyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAllCompanySemesters } from '~/redux/slices/companySemesters';
import styles from './CompanyEventStatistics.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { CompanyEventStatistics as CompanyEventStatisticsType } from '~/redux/actions/CompanyActions';
import type CompanySemester from '~/redux/models/CompanySemester';

type SemesterOption = { label: string; value: EntityId };

const toSemesterOption = (semester: CompanySemester): SemesterOption => ({
  label: semesterToHumanReadable(semester.semester, semester.year),
  value: semester.id,
});

const formatNumber = (value: number) =>
  value.toLocaleString('no-NO', { maximumFractionDigits: 1 });

type Props = {
  companyId: EntityId;
};

const CompanyEventStatistics = ({ companyId }: Props) => {
  const dispatch = useAppDispatch();
  const companySemesters = useAppSelector(selectAllCompanySemesters);

  const sortedSemesters = useMemo(
    () => [...companySemesters].sort(sortSemesterChronologically).reverse(),
    [companySemesters],
  );
  const latestSemesterId = sortedSemesters[0]?.id;

  const [selectedFromSemesterId, setFromSemesterId] = useState<EntityId>();
  const [selectedToSemesterId, setToSemesterId] = useState<EntityId>();
  const fromSemesterId = selectedFromSemesterId ?? latestSemesterId;
  const toSemesterId = selectedToSemesterId ?? latestSemesterId;

  const [statistics, setStatistics] = useState<CompanyEventStatisticsType>();

  usePreparedEffect(
    'fetchCompanyEventStatistics',
    () =>
      fromSemesterId &&
      toSemesterId &&
      dispatch(
        fetchEventStatistics(companyId, fromSemesterId, toSemesterId),
      ).then((response) => setStatistics(response.payload)),
    [companyId, fromSemesterId, toSemesterId],
  );

  const semesterOptions = sortedSemesters.map(toSemesterOption);
  const selectedOption = (semesterId?: EntityId) =>
    semesterOptions.find((option) => option.value === semesterId) ?? null;

  const metrics = [
    { title: 'arrangementer', value: statistics?.eventCount },
    {
      title: 'gjennomsnittlig antall deltakere',
      value: statistics?.averageParticipants,
    },
    {
      title: 'gjennomsnittlig antall på venteliste',
      value: statistics?.averageWaitingList,
    },
  ];

  return (
    <Card>
      <Flex
        wrap
        justifyContent="flex-start"
        gap="var(--spacing-sm)"
        alignItems="center"
        margin="0 0 var(--spacing-md) 0"
      >
        <h3>Statistikk fra</h3>
        <Flex alignItems="center" gap="var(--spacing-sm)">
          <SelectInput
            name="statistics-from-semester"
            className={styles.semesterSelect}
            options={semesterOptions}
            value={selectedOption(fromSemesterId)}
            onChange={(option) =>
              setFromSemesterId((option as SemesterOption).value)
            }
            isClearable={false}
          />
          <h3>til</h3>
          <SelectInput
            name="statistics-to-semester"
            className={styles.semesterSelect}
            options={semesterOptions}
            value={selectedOption(toSemesterId)}
            onChange={(option) =>
              setToSemesterId((option as SemesterOption).value)
            }
            isClearable={false}
          />
        </Flex>
      </Flex>
      <Flex wrap gap="var(--spacing-md)">
        {metrics.map((metric) => (
          <Tag
            className={styles.statisticTag}
            key={metric.title}
            tag={`${metric.value === undefined ? '-' : formatNumber(metric.value)} ${metric.title}`}
            color="gray"
          />
        ))}
      </Flex>
    </Card>
  );
};

export default CompanyEventStatistics;
