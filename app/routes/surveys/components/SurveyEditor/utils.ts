import {
  SurveyQuestionDisplayType,
  SurveyQuestionType,
} from 'app/store/models/SurveyQuestion';
import type { FormSurvey } from 'app/store/models/Survey';
import type { FormSurveyQuestion } from 'app/store/models/SurveyQuestion';

export const initialQuestion: FormSurveyQuestion = {
  questionText: '',
  questionType: { value: SurveyQuestionType.SingleChoice, label: 'Enkeltvalg' },
  displayType: SurveyQuestionDisplayType.PieChart,
  mandatory: false,
  options: [
    {
      optionText: '',
    },
  ],
  relativeIndex: 0,
};

type QuestionsValidationErrors = {
  questions: {
    questionText?: string[];
    options?: {
      optionText?: string[];
    }[];
  }[];
};
export const hasOptions = (
  data: Partial<FormSurvey>,
): QuestionsValidationErrors => {
  const message: QuestionsValidationErrors = {
    questions: [],
  };
  data.questions?.forEach((element, i) => {
    if (
      !['multiple_choice', 'single_choice'].includes(element.questionType.value)
    )
      return;

    const optionsErrors: { optionText?: string[] }[] = [];
    if (element.options.length < 2) {
      optionsErrors[0] = {
        optionText: ['Spørsmål må ha minst ett svaralternativ'],
      };
    }
    for (const option in element.options.slice(0, -1)) {
      if (!element.options[option].optionText) {
        optionsErrors[option] = {
          optionText: ['Svaralternativ kan ikke være tomt'],
        };
      }
    }

    if (optionsErrors.length > 0) {
      message.questions[i] = {
        options: optionsErrors,
      };
    }
  });
  return message;
};
