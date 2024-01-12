import Tag from 'app/components/Tags/Tag';
import type { TagColors } from 'app/components/Tags/Tag';
import type { GraphData } from 'app/routes/surveys/components/Submissions/Results';
import type { ID } from 'app/store/models';
import type { SurveyQuestionOption } from 'app/store/models/SurveyQuestion';

type Props = {
  options: SurveyQuestionOption[];
  data: GraphData[ID];
};
const AveragePill = ({ options, data }: Props) => {
  const average = getAverage(data);
  const [optionMin, optionMax] = getMinMaxOption(options);
  const mappedAverage = mapValueToNewInterval(
    average,
    optionMin,
    optionMax,
    0,
    averageTagColors.length - 1
  );

  return (
    <Tag
      color={averageTagColors[Math.round(mappedAverage)]}
      tag={Number.isNaN(average) ? '?' : String(average)}
    />
  );
};

const averageTagColors: TagColors[] = ['red', 'orange', 'yellow', 'green'];
const getOptionNumber = (optionText: string) => {
  return Number(optionText.match(/^\d+/)?.[0]);
};

const getAverage = (data: GraphData[ID]) => {
  const [sum, numberOfAnswers] = data.reduce(
    (accumulator, optionData) => {
      const optionNumber = getOptionNumber(optionData.name);
      return [
        accumulator[0] + optionData.count * optionNumber,
        accumulator[1] + optionData.count,
      ];
    },
    [0, 0]
  );
  return Number((sum / numberOfAnswers).toFixed(2));
};

/**
 * Returns the lowest and highest number that an option starts with
 */
const getMinMaxOption = (options: SurveyQuestionOption[]) => {
  return options.reduce(
    (result, option) => {
      const optionNumber = getOptionNumber(option.optionText);
      return [
        Math.min(result[0], optionNumber),
        Math.max(result[1], optionNumber),
      ];
    },
    [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
  );
};

/**
 * Linear transform used to map the average from the interval of the alternatives to the interval of number of colors used for the pill
 */
const mapValueToNewInterval = (
  value: number,
  start: number,
  end: number,
  newStart: number,
  newEnd: number
) => {
  return ((value - start) * (newEnd - newStart)) / (end - start) + newStart;
};

export default AveragePill;
