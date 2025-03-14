import React, { useState } from 'react';
import { Flex, Icon, Button } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import Dropdown from '~/components/Dropdown';
import {
  SelectInput,
  TextInput,
  CheckBox,
  DatePicker,
  RowSection,
} from '~/components/Form';
import { FormatTime } from '~/components/Time';
import Attendance from '~/components/UserAttendance/Attendance';
import {
  containsAllergier,
  eventStatusTypes,
  registrationEditingCloseTime,
  tooLow,
  unregistrationEditingCloseTime,
} from '~/pages/events/utils';
import { spyValues } from '~/utils/formSpyUtils';
import styles from '../EventEditor.module.css';
import renderPools from '../renderPools';
import type { EditingEvent } from '~/pages/events/utils';
import { Trash2, CirclePlus, Settings2 } from 'lucide-react';
import cx from 'classnames';


type Props = {
  values: EditingEvent;
};

const Registrations: React.FC<Props> = ({ values }) => {
  const initialPool = {
    name: 'Pool #1',
    registrations: [],
    activationDate: moment(values.startTime)
      .subtract(7, 'd')
      .hour(12)
      .minute(0)
      .toISOString(),
    permissionGroups: [],
  };

  return (
    <>
      {spyValues((values: EditingEvent) => {
        // Adding an initial pool if the event status type allows for it and there are no current pools
        if (['NORMAL', 'INFINITE'].includes(values.eventStatusType?.value)) {
          if (values.pools.length === 0) {
            values.pools = [initialPool];
          }
        } else {
          // Removing all pools so that they are not validated on submit
          if (values.pools.length > 0) {
            values.pools = [];
          }
        }

        return (
          <Field
            label="Påmeldingstype"
            name="eventStatusType"
            component={SelectInput.Field}
            options={eventStatusTypes}
            required
          />
        );
      })}

      {['NORMAL', 'INFINITE'].includes(values.eventStatusType?.value) && (
        <NormalOrInfiniteStatusType values={values} />
      )}
    </>
  );
};

export default Registrations;

type NormalOrInfiniteStatusTypeProps = Props;

const NormalOrInfiniteStatusType: React.FC<NormalOrInfiniteStatusTypeProps> = ({
  values,
}) => {
  const [feedbackQuestions, setFeedbackQuestions] = useState<Array<{
    text: string;
    required: boolean;
    type?: string;
    options?: string[];
  }>>([]);
  const [questionInput, setQuestionInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState({
    text: '',
    type: '',
    required: false,
    options: [] as string[]
  });

  const questionTypeOptions = [
    { label: 'Tekstfelt', value: 'text' },
    { label: 'Checkboxer', value: 'checkboxes' },
    { label: 'Radioknapper', value: 'radio' },
  ];

  const [questionType, setQuestionType] = useState(questionTypeOptions[0].value);
  const [questionOptions, setQuestionOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [simpleDropdownOpen, setSimpleDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const toggleSimpleDropdown = () => {
    setSimpleDropdownOpen(!simpleDropdownOpen);
  };

  const simpleOptions = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' }
  ];


  const handleSelectChange = (selected) => {
    setSelectedOption(selected?.value);
    console.log('Selected:', selected?.value);
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setQuestionOptions([...questionOptions, newOption.trim()]);
      setNewOption('');
    }
  };

  const handleRemoveOption = (optionIndex: number) => {
    setQuestionOptions(questionOptions.filter((_, i) => i !== optionIndex));
  };

  const handleAddQuestion = () => {
    if (questionInput.trim() !== '') {
      const newQuestion = {
        text: questionInput.trim(),
        required: false,
        type: questionType,
        options:
          questionType === 'checkboxes' || questionType === 'radio'
            ? questionOptions
            : []
      };
      setFeedbackQuestions([...feedbackQuestions, newQuestion]);

      setQuestionInput('');
      setQuestionOptions([]);
      setQuestionType(questionTypeOptions[0].value);
    }
  };

  const handleRemoveQuestion = (indexToRemove: number) => {
    setFeedbackQuestions(feedbackQuestions.filter((_, index) => index !== indexToRemove));
    setDropdownOpen(null);
  };

  const handleEditQuestion = (index: number) => {
    const questionToEdit = feedbackQuestions[index];
    setEditingIndex(index);
    setEditingQuestion({
      text: questionToEdit.text,
      type: questionToEdit.type || questionTypeOptions[0].value,
      required: questionToEdit.required,
      options: questionToEdit.options || []
    });
    setQuestionInput(questionToEdit.text);
    setQuestionType(questionToEdit.type || questionTypeOptions[0].value);
    setQuestionOptions(questionToEdit.options || []);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && questionInput.trim()) {
      const updatedQuestions = [...feedbackQuestions];
      updatedQuestions[editingIndex] = {
        text: questionInput.trim(),
        required: editingQuestion.required,
        type: questionType,
        options:
          questionType === 'checkboxes' || questionType === 'radio'
            ? questionOptions
            : []
      };

      setFeedbackQuestions(updatedQuestions);

      setEditingIndex(null);
      setQuestionInput('');
      setQuestionOptions([]);
      setQuestionType(questionTypeOptions[0].value);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setQuestionInput('');
    setQuestionOptions([]);
    setQuestionType(questionTypeOptions[0].value);
  };

  // Function to toggle required status
  const toggleQuestionRequired = (index: number) => {
    const updatedQuestions = [...feedbackQuestions];
    updatedQuestions[index].required = !updatedQuestions[index].required;
    setFeedbackQuestions(updatedQuestions);
  };

  // Toggle dropdown menu
  const toggleDropdown = (index: number) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  return (
    <>
      <div>
        <Field
          label="Betalt arrangement"
          name="isPriced"
          type="checkbox"
          component={CheckBox.Field}
        />
        {values.isPriced && (
          <Flex column gap="var(--spacing-sm)" className={styles.subSection}>
            <Field
              label="Betaling via Abakus.no"
              description="Manuell betaling kan også godkjennes i påmeldingsoversikt i etterkant"
              name="useStripe"
              type="checkbox"
              component={CheckBox.Field}
            />
            <RowSection>
              <Field
                label="Pris"
                name="priceMember"
                type="number"
                component={TextInput.Field}
                warn={tooLow}
                required
              />
              <Field
                label="Betalingsfrist"
                name="paymentDueDate"
                component={DatePicker.Field}
              />
            </RowSection>
          </Flex>
        )}
      </div>
      <div>
        <Field
          label="Bruk prikker"
          name="heedPenalties"
          type="checkbox"
          component={CheckBox.Field}
        />
        {values.heedPenalties && (
          <div className={styles.subSection}>
            <Field
              key="unregistrationDeadline"
              label="Frist for prikk"
              description="Avmelding etter denne fristen vil gi prikk"
              name="unregistrationDeadline"
              component={DatePicker.Field}
            />
          </div>
        )}
      </div>
      <div>
        <Field
          key="registrationDeadlineHours"
          label="Påmeldingsfrist (timer før arrangementsstart)"
          description="Etter denne fristen er det ikke mulig å melde seg på. Gjelder også avmelding, med mindre separat avregistreringsfrist er valgt. Negativ verdi gir frist etter arrangementstart."
          name="registrationDeadlineHours"
          type="number"
          component={TextInput.Field}
        />
        <span className={styles.registrationDeadlineHours}>
          {`${values.separateDeadlines ? 'Påmelding stenger' : 'Påmelding og avmelding stenger'} `}
          <FormatTime time={registrationEditingCloseTime(values)} />
        </span>
      </div>
      <div>
        <Field
          label="Separat avmeldingsfrist"
          description="Velg om du vil ha en separat frist for avmelding"
          name="separateDeadlines"
          type="checkbox"
          component={CheckBox.Field}
        />
        {values.separateDeadlines && (
          <div className={styles.subSection}>
            <Field
              key="unregistrationDeadlineHours"
              label="Avmeldingsfrist (timer før arrangementsstart)"
              description="Etter denne fristen er det ikke mulig å melde seg av. Negativ verdi gir frist etter arrangementstart."
              name="unregistrationDeadlineHours"
              type="number"
              component={TextInput.Field}
            />
            <span className={styles.unregistrationDeadlineHours}>
              Avmelding stenger{' '}
              <FormatTime time={unregistrationEditingCloseTime(values)} />
            </span>
          </div>
        )}
      </div>
      <Field
        label="Samtykke til bilder"
        description="Bruk samtykke til bilder"
        name="useConsent"
        type="checkbox"
        component={CheckBox.Field}
      />
      <Field
        label="Påmeldingsspørsmål"
        description="Still et spørsmål ved påmelding"
        name="hasFeedbackQuestion"
        type="checkbox"
        component={CheckBox.Field}
      />
      {values.hasFeedbackQuestion && (
        <div className={styles.subSection}>
          <div className={styles.feedbackQuestion}>
            <div className={styles.feedbackInputRow}>
              <SelectInput
                name="questionTypeSelect"
                label={editingIndex !== null ? "Rediger spørsmålstype" : "Spørsmålstype"}
                options={questionTypeOptions}
                onChange={(selected) => setQuestionType(selected.value)}
                value={questionTypeOptions.find(
                  (opt) => opt.value === questionType
                )}
              />

              <TextInput
                placeholder={editingIndex !== null ? "Rediger spørsmål..." : "Skriv et spørsmål..."}
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
              />

              {editingIndex !== null ? (
                <>
                  <Button
                    onPress={handleSaveEdit}
                    disabled={!questionInput.trim()}
                    style={{ backgroundColor: 'var(--success-color)' }}
                  >
                    Lagre endringer
                  </Button>
                  <Button
                    onPress={handleCancelEdit}
                    style={{ backgroundColor: 'var(--danger-color)' }}
                  >
                    Avbryt
                  </Button>
                </>
              ) : (
                <Button
                  onPress={handleAddQuestion}
                  disabled={!questionInput.trim() || (questionOptions.length < 2 && (questionType === 'checkboxes' || questionType === 'radio'))}
                  title={
                    questionInput.trim() &&
                    questionOptions.length < 2 &&
                    (questionType === 'checkboxes' || questionType === 'radio')
                      ? "Må minst ha 2 alternativ"
                      : undefined
                  }
                >
                  <Icon iconNode={<CirclePlus />} size={16} />
                  Legg til spørsmål
                </Button>
              )}
            </div>

            {(questionType === 'checkboxes' || questionType === 'radio') && (
              <div style={{ marginTop: 'var(--spacing-sm)' }}>
                <h4>Alternativer:</h4>
                <div className={styles.optionsInputRow}>
                  <TextInput
                    placeholder="Legg til et alternativ..."
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                  />
                  <Button onPress={handleAddOption} disabled={!newOption.trim()}>
                    <Icon iconNode={<CirclePlus />} size={16} />
                    Legg til alternativ
                  </Button>
                </div>

                {questionOptions.length > 0 && (
                  <ul>
                    {questionOptions.map((option, index) => (
                      <li key={index} className={styles.optionItem}>
                        <span>{option}</span>
                        <Button
                          onPress={() => handleRemoveOption(index)}
                        >
                          <Icon iconNode={<Trash2 />} size={16} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* List of added questions */}
            {feedbackQuestions.length > 0 && (
              <div className={styles.feedbackOptions}>
                <h4>Spørsmål som vil bli stilt:</h4>
                <ul>
                  {feedbackQuestions.map((question, index) => (
                    <li key={index} className={styles.feedbackQuestionItem}>
                      <span className={styles.question}>
                        {question.text}
                        {question.required ? ' (Obligatorisk)' : ''}
                        {' — '}
                        <em>{question.type}</em>
                      </span>

                      {/* Show options if applicable */}
                      {question.options?.length > 0 && (
                        <ul>
                          {question.options.map((opt, optIndex) => (
                            <li key={optIndex} className={styles.optionItem}>
                              <span>{opt}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className={styles.questionActions}>
                        {/* Toggle required button */}
                        <Button
                          onPress={() => toggleQuestionRequired(index)}
                          disabled={editingIndex !== null}
                          size="sm"
                          className={cx(
                            styles.requiredButton,
                            question.required && styles.active
                          )}
                        >
                          {question.required ? 'Obligatorisk' : 'Valgfri'}
                        </Button>

                        {/* Edit button */}
                        <Button
                          onPress={() => handleEditQuestion(index)}
                          disabled={editingIndex !== null}
                        >
                          <Icon iconNode={<Settings2 />} size={16} />
                        </Button>

                        {/* Delete button */}
                        <Button
                          onPress={() => handleRemoveQuestion(index)}
                          disabled={editingIndex === index}
                        >
                          <Icon iconNode={<Trash2 />} size={16} />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hidden field to store questions */}
            <input
              type="hidden"
              name="feedbackQuestionsList"
              value={JSON.stringify(feedbackQuestions)}
            />
          </div>
        </div>
      )}

      <div>
        <h3>Pools</h3>
        <Attendance pools={values.pools} showUserGrid={false} />
        <div className={styles.metaList}>
          <FieldArray name="pools"
            component={renderPools}
            startTime={values.startTime}
            eventStatusType={values.eventStatusType?.value}
          />
        </div>
        {values.pools?.length > 1 && (
          <Field
            label="Sammenslåingstidspunkt"
            description="Tidspunkt for å slå sammen poolene"
            name="mergeTime"
            component={DatePicker.Field}
          />
        )}
      </div>
    </>
  );
};

