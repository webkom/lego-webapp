import { useEffect } from 'react';
import { GroupType } from 'app/models';
import AttendanceModalContent from '~/components/UserAttendance/AttendanceModalContent';
import { User } from '~/redux/actionTypes';
import { useAppDispatch } from '~/redux/hooks';
import type {
  AttendanceModalPool,
  AttendanceModalRegistration,
} from '~/components/UserAttendance/AttendanceModalContent';
import type { PublicUserWithAbakusGroups } from '~/redux/models/User';

const user = (
  id: number,
  fullName: string,
  username: string,
  abakusGroups: number[],
): PublicUserWithAbakusGroups =>
  ({
    id,
    fullName,
    username,
    firstName: fullName.split(' ')[0],
    lastName: fullName.split(' ').slice(1).join(' '),
    gender: 'other',
    profilePicture: '',
    profilePicturePlaceholder: '',
    abakusGroups,
    achievements: [],
    achievementsScore: 0,
    achievementRank: 0,
  }) as PublicUserWithAbakusGroups;

const registration = (
  id: number,
  fullName: string,
  username: string,
  abakusGroups: number[],
  pool: number,
): AttendanceModalRegistration => ({
  id,
  user: user(id, fullName, username, abakusGroups),
  pool,
});

const pools: AttendanceModalPool[] = [
  {
    name: 'Påmeldte',
    registrations: [
      registration(1, 'Ada Lovelace', 'ada', [16, 101, 103, 104], 1),
      registration(2, 'Grace Hopper', 'grace', [17, 102, 105, 106], 1),
    ],
  },
  {
    name: 'Venteliste',
    registrations: [
      registration(3, 'Katherine Johnson', 'katherine', [17, 101, 103, 106], 2),
    ],
  },
];

const defaultCurrentUserGroupIds = [101, 101, 102, 103, 104, 105, 106];

type FixtureGroup = {
  id: number;
  name: string;
  type: GroupType;
};

const noAdditionalGroups: FixtureGroup[] = [];
const overflowGroups: FixtureGroup[] = [
  { id: 201, name: 'AbaQ', type: GroupType.Committee },
  { id: 202, name: 'Bedkom', type: GroupType.Committee },
  { id: 203, name: 'Dotkom', type: GroupType.Committee },
  { id: 204, name: 'Fagkom', type: GroupType.Committee },
  { id: 205, name: 'Koskom', type: GroupType.Committee },
  { id: 206, name: 'LaBamba', type: GroupType.Committee },
  { id: 207, name: 'PR', type: GroupType.Committee },
  { id: 208, name: 'Prokom', type: GroupType.Committee },
  { id: 209, name: 'Statkom', type: GroupType.Committee },
  { id: 210, name: 'Tripkom', type: GroupType.Committee },
  { id: 211, name: 'UKA', type: GroupType.Committee },
  { id: 212, name: 'Xcom', type: GroupType.Committee },
];
const overflowCurrentUserGroupIds = [
  ...defaultCurrentUserGroupIds,
  ...overflowGroups.map((group) => group.id),
];

const AttendanceHarness = ({
  isMeeting = false,
  currentUserGroupIds = defaultCurrentUserGroupIds,
  additionalGroups = noAdditionalGroups,
}: {
  isMeeting?: boolean;
  currentUserGroupIds?: number[];
  additionalGroups?: FixtureGroup[];
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch({
      type: User.FETCH.SUCCESS,
      payload: {
        result: 9001,
        entities: {
          users: {
            9001: {
              id: 9001,
              username: 'preview-user',
              fullName: 'Preview User',
              firstName: 'Preview',
              lastName: 'User',
              gender: 'other',
              profilePicture: '',
              profilePicturePlaceholder: '',
              abakusGroups: currentUserGroupIds,
              icalToken: 'preview',
            },
          },
          groups: {
            101: {
              id: 101,
              name: 'Webkom',
              type: GroupType.Committee,
            },
            102: {
              id: 102,
              name: 'Readme',
              type: GroupType.Committee,
            },
            103: {
              id: 103,
              name: 'Kulisse',
              type: GroupType.Revue,
            },
            104: { id: 104, name: 'Abakus', type: GroupType.Other },
            105: { id: 105, name: 'Mystery', type: 'mystery' },
            106: {
              id: 106,
              name: 'Kodeklubben',
              type: GroupType.Interest,
            },
            ...Object.fromEntries(
              additionalGroups.map((group) => [group.id, group]),
            ),
          },
        },
      },
      meta: { endpoint: 'preview', isCurrentUser: true },
    });
  }, [additionalGroups, currentUserGroupIds, dispatch]);

  return (
    <AttendanceModalContent
      pools={pools}
      selectedPool={0}
      togglePool={() => undefined}
      isMeeting={isMeeting}
    />
  );
};

const attendeeRows = () =>
  cy.get('[data-test-id="attendance-modal-content"] ul li');

const filterChips = () => cy.get('[data-test-id="attendance-filter-chip"]');

describe('<AttendanceModalContent />', () => {
  it('shows selected colon filters as removable tags under the search bar', () => {
    cy.mount(<AttendanceHarness />);
    cy.get('html').invoke('attr', 'data-theme', 'dark');
    cy.get('input[placeholder="Søk etter navn eller skriv :gruppe"]')
      .should('have.attr', 'role', 'combobox')
      .as('attendanceSearch');

    attendeeRows().should('have.length', 3);
    cy.contains('button', '1. Klasse').should('not.exist');
    cy.contains('button', '5. Klasse').should('not.exist');
    cy.get('[data-test-id="attendance-filter-trigger"]').should('exist');
    cy.contains('button', 'Alle').should('have.attr', 'aria-pressed', 'true');
    cy.contains('button', 'Påmeldte').should('exist');
    cy.contains('button', 'Venteliste').should('exist');
    filterChips().should('not.exist');

    cy.get('@attendanceSearch').type(':');
    cy.get('[role="option"]').should('have.length', 11);
    cy.get('[role="option"]').eq(0).should('contain.text', '1. Klasse');
    cy.get('[role="option"]').eq(4).should('contain.text', '5. Klasse');
    cy.get('[role="option"]').eq(5).should('contain.text', 'Cyber');
    cy.get('[role="option"]').eq(6).should('contain.text', 'Data');
    cy.get('[role="option"]').eq(7).should('contain.text', 'Readme');
    cy.get('[role="option"]').eq(8).should('contain.text', 'Webkom');
    cy.get('[role="option"]').eq(9).should('contain.text', 'Kodeklubben');
    cy.get('[role="option"]')
      .eq(10)
      .should('contain.text', 'Kulisse')
      .and('contain.text', 'Revy');
    cy.get('[role="listbox"]').should('not.contain.text', 'Abakus');
    cy.get('[role="listbox"]').should('not.contain.text', 'Mystery');
    cy.get('[data-group-type="klasse"]')
      .first()
      .should('have.css', 'background-color')
      .and('not.equal', 'rgba(0, 0, 0, 0)');
    cy.get('[data-group-type="studieretning"]')
      .first()
      .should('have.css', 'background-color')
      .and('not.equal', 'rgba(0, 0, 0, 0)');

    cy.get('@attendanceSearch').clear();
    cy.get('@attendanceSearch').type('Grace');
    attendeeRows().should('have.length', 1).and('contain.text', 'Grace Hopper');

    cy.get('@attendanceSearch').clear().type('Webkom');
    attendeeRows().should('have.length', 2);
    attendeeRows().should('contain.text', 'Ada Lovelace');
    attendeeRows().should('contain.text', 'Katherine Johnson');

    cy.get('@attendanceSearch').clear().type('Abakus');
    cy.get('[data-test-id="attendance-modal-content"] ul li').should(
      'not.exist',
    );
    cy.contains('Ingen treff').should('be.visible');

    cy.get('@attendanceSearch').clear().type('Mystery');
    cy.get('[data-test-id="attendance-modal-content"] ul li').should(
      'not.exist',
    );

    cy.get('@attendanceSearch').clear().type(':we');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]')
      .should('be.visible')
      .and('contain.text', 'Webkom');
    cy.get('[role="option"]')
      .should('have.length', 1)
      .and('have.attr', 'aria-selected', 'true');

    cy.get('@attendanceSearch')
      .type('{enter}')
      .should('have.value', '')
      .and('be.focused');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]').should('not.exist');
    filterChips()
      .should('have.length', 1)
      .and('contain.text', 'Webkom')
      .and('have.attr', 'aria-label', 'Fjern filter: Webkom');
    attendeeRows().should('have.length', 2);
    attendeeRows().should('contain.text', 'Ada Lovelace');
    attendeeRows().should('contain.text', 'Katherine Johnson');
    cy.get('[data-test-id="attendance-filter-count"]').should(
      'contain.text',
      '2 av 3',
    );
    cy.get('[data-test-id="attendance-filter-trigger"]').should(
      'have.attr',
      'data-active-count',
      '1',
    );

    cy.get('@attendanceSearch').type(':Webkom');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]')
      .should('be.visible')
      .and('contain.text', 'Ingen grupper matcher søket.');
    attendeeRows().should('have.length', 2);

    cy.get('@attendanceSearch').type('{esc}');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]').should('not.exist');
    cy.get('@attendanceSearch').clear();
    attendeeRows().should('have.length', 2);

    cy.get('@attendanceSearch').type('{backspace}');
    filterChips().should('not.exist');
    attendeeRows().should('have.length', 3);

    cy.get('@attendanceSearch').clear().type(':re');
    cy.contains('[role="option"]', 'Readme').then(($option) => {
      ($option[0] as HTMLButtonElement).click();
    });
    cy.get('@attendanceSearch').should('have.value', '');
    filterChips().should('have.length', 1).and('contain.text', 'Readme');
    attendeeRows().should('have.length', 1).and('contain.text', 'Grace Hopper');

    cy.contains('button', 'Nullstill').click();
    filterChips().should('not.exist');
    attendeeRows().should('have.length', 3);

    cy.get('@attendanceSearch').clear().type(':unknown');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]')
      .should('be.visible')
      .and('contain.text', 'Ingen grupper matcher søket.');
    attendeeRows().should('have.length', 3);

    cy.get('@attendanceSearch').type('{esc}');
    cy.get('[role="listbox"][aria-label="Gruppeforslag"]').should('not.exist');
  });

  it('composes a class picker filter with a group tag', () => {
    cy.mount(<AttendanceHarness />);
    cy.get('[role="group"][aria-label="Filtrer på kull"]').should('not.exist');
    cy.get('[data-test-id="attendance-filter-trigger"]')
      .as('filterTrigger')
      .click();

    cy.contains('[role="dialog"] button', /^2\. Klasse$/)
      .focus()
      .should('be.focused')
      .and('have.attr', 'type', 'button')
      .click()
      .should('have.attr', 'aria-pressed', 'true');
    cy.get('input[placeholder="Søk etter navn eller skriv :gruppe"]').should(
      'have.value',
      '',
    );
    filterChips().should('have.length', 1).and('contain.text', '2. Klasse');
    attendeeRows().should('have.length', 2);

    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '1');
    cy.get('[data-test-id="attendance-filter-badge"]')
      .should('be.visible')
      .and('contain.text', '1');

    cy.contains('[role="dialog"] button', /^2\. Klasse$/)
      .click()
      .should('have.attr', 'aria-pressed', 'false');
    filterChips().should('not.exist');
    attendeeRows().should('have.length', 3);

    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '0');

    cy.contains('[role="dialog"] button', /^1\. Klasse$/).click();
    filterChips().should('have.length', 1).and('contain.text', '1. Klasse');
    attendeeRows().should('have.length', 1).and('contain.text', 'Ada Lovelace');

    cy.focused().type('{esc}');
    cy.get('input[placeholder="Søk etter navn eller skriv :gruppe"]')
      .type('Grace')
      .should('have.value', 'Grace');
    cy.contains('Ingen treff').should('be.visible');
    cy.get('input[placeholder="Søk etter navn eller skriv :gruppe"]')
      .clear()
      .type(':we')
      .type('{enter}')
      .should('have.value', '');
    filterChips()
      .should('have.length', 2)
      .and('contain.text', '1. Klasse')
      .and('contain.text', 'Webkom');
    attendeeRows().should('have.length', 1).and('contain.text', 'Ada Lovelace');

    cy.get('@filterTrigger').click();
    cy.contains('[role="dialog"] button', /^1\. Klasse$/).click();
    filterChips().should('have.length', 1).and('contain.text', 'Webkom');
    attendeeRows().should('have.length', 2);

    cy.focused().type('{esc}');
    cy.contains('button', 'Nullstill').click();
    filterChips().should('not.exist');
    attendeeRows().should('have.length', 3);
  });

  it('offers a bounded group picker beside the desktop search', () => {
    cy.viewport(1280, 800);
    cy.mount(
      <AttendanceHarness
        currentUserGroupIds={overflowCurrentUserGroupIds}
        additionalGroups={overflowGroups}
      />,
    );

    cy.get('[role="group"][aria-label="Filtrer på kull"]').should('not.exist');
    cy.contains('button', '1. Klasse').should('not.exist');
    cy.contains('button', '5. Klasse').should('not.exist');

    cy.get('[data-test-id="attendance-filter-trigger"]')
      .as('filterTrigger')
      .should('have.attr', 'data-active-count', '0')
      .click();

    cy.get('[role="dialog"][aria-label="Filtrer deltakere"]')
      .should('be.visible')
      .and('contain.text', 'Kull')
      .and('contain.text', '1. Klasse')
      .and('contain.text', '5. Klasse')
      .and('contain.text', 'Studieretning')
      .and('contain.text', 'Data')
      .and('contain.text', 'Cyber')
      .and('contain.text', 'Grupper')
      .and('contain.text', 'Kulisse');

    cy.get('[data-test-id="attendance-filter-popover"]')
      .should('have.css', 'overflow-y', 'auto')
      .then(($popover) => {
        expect($popover[0].clientHeight).to.be.at.most(360);
        expect($popover[0].scrollHeight).to.be.greaterThan(
          $popover[0].clientHeight,
        );
      })
      .scrollTo('bottom')
      .then(($popover) => {
        expect($popover[0].scrollTop).to.be.greaterThan(0);
      });

    cy.contains('[role="dialog"] button', 'Kulisse')
      .click()
      .should('have.attr', 'aria-pressed', 'true');
    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '1');
    cy.get('input[role="combobox"]').should('have.value', '');
    filterChips().should('have.length', 1).and('contain.text', 'Kulisse');
    attendeeRows().should('have.length', 2);

    cy.get('[data-test-id="attendance-filter-popover"]').scrollTo('top');
    cy.contains('[role="dialog"] button', /^2\. Klasse$/)
      .click()
      .should('have.attr', 'aria-pressed', 'true');
    filterChips()
      .should('have.length', 2)
      .and('contain.text', '2. Klasse')
      .and('contain.text', 'Kulisse');
    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '2');
    attendeeRows()
      .should('have.length', 1)
      .and('contain.text', 'Katherine Johnson');

    cy.contains('[role="dialog"] button', /^2\. Klasse$/).click();
    filterChips().should('have.length', 1).and('contain.text', 'Kulisse');
    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '1');

    cy.focused().type('{esc}');
    cy.get('input[role="combobox"]').clear().type(':we').type('{enter}');
    filterChips()
      .should('have.length', 2)
      .and('contain.text', 'Kulisse')
      .and('contain.text', 'Webkom');
    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '2');
    attendeeRows().should('have.length', 2);
  });

  it('offers all supported filters from one compact inline mobile panel', () => {
    cy.viewport(375, 812);
    // The inline panel requires a touch-capable narrow viewport (real phone)
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'maxTouchPoints', { value: 5 });
    });
    cy.mount(<AttendanceHarness />);

    cy.get('input[role="combobox"]')
      .as('attendanceSearch')
      .should('not.be.focused');
    cy.get('[role="group"][aria-label="Filtrer på kull"]').should('not.exist');
    cy.get('[data-test-id="attendance-filter-trigger"]')
      .as('filterTrigger')
      .should('have.attr', 'data-active-count', '0')
      .and('have.attr', 'aria-expanded', 'false')
      .click()
      .should('have.attr', 'aria-expanded', 'true');
    cy.get('@attendanceSearch').should('not.be.focused');

    const filterPanel = () =>
      cy.get('[data-test-id="attendance-filter-panel"]');

    filterPanel()
      .should('be.visible')
      .and('contain.text', 'Kull')
      .and('contain.text', 'Studieretning')
      .and('contain.text', 'Data')
      .and('contain.text', 'Cyber')
      .and('contain.text', 'Grupper')
      .and('contain.text', 'Kulisse')
      .and('contain.text', 'Revy')
      .and('not.contain.text', 'Abakus')
      .and('not.contain.text', 'Mystery');

    const panelOption = (label: string) =>
      cy.contains('[data-test-id="attendance-filter-panel"] button', label);

    panelOption(/^2\. Klasse$/)
      .click()
      .should('have.attr', 'aria-pressed', 'true');
    filterPanel().should('be.visible');
    cy.get('@filterTrigger')
      .should('have.attr', 'data-active-count', '1')
      .and('have.attr', 'aria-label', 'Filtrer deltakere, 1 aktivt filter');
    filterChips().should('have.length', 1).and('contain.text', '2. Klasse');
    attendeeRows().should('have.length', 2);

    panelOption(/^1\. Klasse$/).click();
    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '1');
    panelOption(/^1\. Klasse$/).should('have.attr', 'aria-pressed', 'true');
    panelOption(/^2\. Klasse$/).should('have.attr', 'aria-pressed', 'false');
    filterChips().should('have.length', 1).and('contain.text', '1. Klasse');
    attendeeRows().should('have.length', 1).and('contain.text', 'Ada Lovelace');

    panelOption(/^2\. Klasse$/).click();
    panelOption('Kulisse').click();
    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '2');
    filterChips()
      .should('have.length', 2)
      .and('contain.text', '2. Klasse')
      .and('contain.text', 'Kulisse');
    attendeeRows()
      .should('have.length', 1)
      .and('contain.text', 'Katherine Johnson');

    panelOption('Kodeklubben').click();
    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '3');
    attendeeRows().should('have.length', 2);

    panelOption('Kulisse').click().should('have.attr', 'aria-pressed', 'false');
    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '2');

    cy.focused().type('{esc}');
    filterPanel().should('not.exist');
    cy.get('@filterTrigger')
      .should('have.attr', 'aria-expanded', 'false')
      .and('be.focused');

    cy.get('@filterTrigger').click();
    filterPanel().should('be.visible');

    cy.contains('button', 'Nullstill').click();
    filterChips().should('not.exist');
    cy.get('@filterTrigger').should('have.attr', 'data-active-count', '0');
    cy.get('@attendanceSearch').should('have.value', '');
    attendeeRows().should('have.length', 3);
  });

  it('keeps mobile meeting filters membership-only', () => {
    cy.viewport(375, 812);
    cy.window().then((win) => {
      Object.defineProperty(win.navigator, 'maxTouchPoints', { value: 5 });
    });
    cy.mount(<AttendanceHarness isMeeting />);

    cy.get('[data-test-id="attendance-filter-trigger"]').click();
    cy.get('[data-test-id="attendance-filter-panel"]')
      .should('be.visible')
      .and('not.contain.text', 'Kull')
      .and('not.contain.text', 'Studieretning')
      .and('not.contain.text', '1. Klasse')
      .and('contain.text', 'Kulisse')
      .and('not.contain.text', 'Abakus')
      .and('not.contain.text', 'Mystery');

    cy.contains(
      '[data-test-id="attendance-filter-panel"] button',
      'Kulisse',
    ).click();
    cy.get('[data-test-id="attendance-filter-trigger"]').should(
      'have.attr',
      'data-active-count',
      '1',
    );
    filterChips().should('have.length', 1).and('contain.text', 'Kulisse');
    attendeeRows().should('have.length', 2);

    cy.mount(<AttendanceHarness isMeeting currentUserGroupIds={[104, 105]} />);
    cy.get('[data-test-id="attendance-filter-trigger"]').should('not.exist');
    cy.get('input').should('have.attr', 'placeholder', 'Søk etter navn');
  });

  it('filters by study program (Data, Cyber) and composes with class and groups', () => {
    cy.mount(<AttendanceHarness />);
    cy.get('input[placeholder="Søk etter navn eller skriv :gruppe"]')
      .as('attendanceSearch');

    // Filter using alias :komtek
    cy.get('@attendanceSearch').type(':komtek');
    cy.get('[role="option"]')
      .should('have.length', 1)
      .and('contain.text', 'Cyber');
    cy.get('[role="option"]').first().click();

    filterChips().should('have.length', 1).and('contain.text', 'Cyber');
    // None of the mock users belong to Cyber
    attendeeRows().should('have.length', 0);
    cy.contains('Ingen treff').should('be.visible');

    // Selecting Data replaces Cyber
    cy.get('@attendanceSearch').type(':data');
    cy.get('[role="option"]')
      .should('have.length', 1)
      .and('contain.text', 'Data');
    cy.get('[role="option"]').first().click();

    filterChips().should('have.length', 1).and('contain.text', 'Data');
    // All 3 mock users belong to Datateknologi
    attendeeRows().should('have.length', 3);

    // Compose with grade filter 1. Klasse
    cy.get('[data-test-id="attendance-filter-trigger"]').click();
    cy.contains('[role="dialog"] button', /^1\. Klasse$/).click();
    cy.focused().type('{esc}');

    filterChips()
      .should('have.length', 2)
      .and('contain.text', 'Data')
      .and('contain.text', '1. Klasse');
    // Only Ada Lovelace is 1. Klasse Datateknologi
    attendeeRows().should('have.length', 1).and('contain.text', 'Ada Lovelace');

    // Switch grade to 2. Klasse from the picker
    cy.get('[data-test-id="attendance-filter-trigger"]').click();
    cy.contains('[role="dialog"] button', /^2\. Klasse$/).click();
    cy.focused().type('{esc}');

    filterChips()
      .should('have.length', 2)
      .and('contain.text', 'Data')
      .and('contain.text', '2. Klasse');
    // Grace Hopper and Katherine Johnson are 2. Klasse Datateknologi
    attendeeRows().should('have.length', 2);

    // Also compose with a committee (Webkom)
    cy.get('@attendanceSearch').type(':we').type('{enter}');
    filterChips().should('have.length', 3);
    // Katherine Johnson is Webkom + 2. Klasse + Data
    attendeeRows().should('have.length', 1).and('contain.text', 'Katherine Johnson');

    // Clear all filters
    cy.contains('button', 'Nullstill').click();
    filterChips().should('not.exist');
    attendeeRows().should('have.length', 3);
  });
});

