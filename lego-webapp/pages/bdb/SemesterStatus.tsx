import Tags from '~/components/Tags';
import Tag from '~/components/Tags/Tag';
import { SemesterStatusConfig } from './utils';
import type { CompanySemesterStatus } from '~/redux/models/Company';

type Props = {
  statuses: CompanySemesterStatus[];
};

const SemesterStatus = ({ statuses }: Props) =>
  statuses.length > 0 ? (
    <Tags>
      {statuses.map((status) => (
        <Tag
          key={status}
          tag={SemesterStatusConfig[status].displayName}
          textColor={SemesterStatusConfig[status].textColor}
          backgroundColor={SemesterStatusConfig[status].color}
        />
      ))}
    </Tags>
  ) : (
    <span className="secondaryFontColor">-</span>
  );

export default SemesterStatus;
