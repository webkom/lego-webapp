import { Button, LinkButton } from '../../Button';
import { CardContent, BaseCard } from '../../Card/BaseCard';
import HeroPage from './HeroPage';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Layout/HeroPage',
  component: HeroPage,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    actions: { control: false },
    aside: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof HeroPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Artikler',
    lead: 'Nyheter, reportasjer og oppdateringer fra Abakus, komiteene og livet på linja.',
    actions: (
      <>
        <Button dark>Primær handling</Button>
        <LinkButton ghost href="#">
          Sekundær handling
        </LinkButton>
      </>
    ),
    aside: (
      <BaseCard shadow>
        <CardContent>Spotlight</CardContent>
      </BaseCard>
    ),
    children: (
      <HeroPage.Section title="Seksjon" headerActions={<Button>Filter</Button>}>
        <BaseCard shadow>
          <CardContent>Innhold</CardContent>
        </BaseCard>
      </HeroPage.Section>
    ),
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Enkel side',
    children: (
      <HeroPage.Section title="Seksjon uten skillelinje" divider={false}>
        <BaseCard shadow>
          <CardContent>Innhold</CardContent>
        </BaseCard>
      </HeroPage.Section>
    ),
  },
};
