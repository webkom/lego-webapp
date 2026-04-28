import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { debounce } from 'lodash-es';
import { GraduationCap, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import type { University } from '~/app/models';
import { SelectInput } from '~/components/Form';
import { autocomplete } from '~/redux/actions/SearchActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAutocompleteRedux } from '~/redux/slices/search';

const ExchangeField = () => {
    const [query, setQuery] = useState('');
    const searchResults = useAppSelector(selectAutocompleteRedux);
    const dispatch = useAppDispatch();

    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 10 }, (_, i) => ({
        label: String(currentYear - 5 + i),
        value: currentYear - 5 + i,
    }));

    const semesterOptions = [
        { label: 'Vår', value: 'vår' },
        { label: 'Høst', value: 'høst' },
    ];

    const onSearchUniversities = debounce((searchQuery: string) => {
        setQuery(searchQuery);
        if (searchQuery.length >= 2) {
            dispatch(autocomplete(searchQuery, ['users.university']));
        }
    }, 300);

    // Filter and map search results to university options
    const universityOptions = searchResults
        .filter((result) => result.contentType === 'users.university')
        .map((result) => {
            const uni = result as unknown as University;
            return {
                label: `${uni.name}, ${uni.country.name}`,
                value: uni.id,
            };
        });

    return (
        <FieldArray name="exchanges">
            {({ fields }) => (
                <Flex column gap="var(--spacing-md)">
                    <Flex alignItems="center" gap="var(--spacing-sm)">
                        <Icon iconNode={<GraduationCap />} />
                        <label>Utvekslingsopphold</label>
                    </Flex>

                    {fields.map((name, index) => (
                        <Flex
                            key={name}
                            gap="var(--spacing-sm)"
                            alignItems="flex-end"
                            wrap
                        >
                            <div style={{ flex: '2 1 300px', minWidth: '200px' }}>
                                <Field
                                    name={`${name}.university`}
                                    label={index === 0 ? 'Universitet' : undefined}
                                    component={SelectInput.AutocompleteField}
                                    onInputChange={onSearchUniversities}
                                    options={universityOptions}
                                    placeholder="Søk etter universitet..."
                                    required
                                />
                            </div>

                            <div style={{ flex: '1 1 120px', minWidth: '100px' }}>
                                <Field
                                    name={`${name}.semester`}
                                    label={index === 0 ? 'Semester' : undefined}
                                    component={SelectInput.Field}
                                    options={semesterOptions}
                                    placeholder="Velg semester"
                                    required
                                />
                            </div>

                            <div style={{ flex: '1 1 120px', minWidth: '100px' }}>
                                <Field
                                    name={`${name}.year`}
                                    label={index === 0 ? 'År' : undefined}
                                    component={SelectInput.Field}
                                    options={yearOptions}
                                    placeholder="Velg år"
                                    required
                                />
                            </div>

                            <ConfirmModal
                                title="Fjern utveksling"
                                message="Er du sikker på at du vil fjerne denne utvekslingen?"
                                onConfirm={() => fields.remove(index)}
                            >
                                {({ openConfirmModal }) => (
                                    <Button onPress={openConfirmModal} danger size="small">
                                        <Trash2 size={16} />
                                    </Button>
                                )}
                            </ConfirmModal>
                        </Flex>
                    ))}

                    <Button
                        onPress={() =>
                            fields.push({ university: null, semester: null, year: null })
                        }
                        secondary
                    >
                        Legg til utveksling
                    </Button>
                </Flex>
            )}
        </FieldArray>
    );
};

export default ExchangeField;