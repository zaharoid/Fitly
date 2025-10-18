import type { StoryObj } from '@storybook/vue3';
import CountBadge from './CountBadge.vue';
import { setupStory } from '~/.storybook/helpers/setupStory';

const meta = {
  title: 'Badge/CountBadge',
  component: CountBadge,
  tags: ['autodocs'],
  argTypes: {
    count: { control: 'range', options: { min: 0, max: 100, step: 1 } },
  },
  args: {
    count: 100,
  },
};

export default meta;

type Story = StoryObj<typeof CountBadge>;

const Template: Story = {
  render: (args, { component }) => {
    return {
      components: { CountBadge },
      setup: () => setupStory({ args, component }),
      template: `
        <div>
          <CountBadge
            v-bind="onlyProps"
            v-on="onlyActions"
          />
        </div>`,
    };
  },
};

export const Primary: Story = {
  ...Template,
  name: 'Basic',
};
