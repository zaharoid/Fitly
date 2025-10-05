import type { Meta, StoryObj } from '@storybook/vue3';
import VBtn from './VBtn.vue';
import {
  btnTypeOptions,
  viewModeOptions,
} from '~t/Btn';
import { setupStory } from '~/.storybook/helpers/setupStory';

const FIGMA_LINKS = {
  main: 'https://www.figma.com/file/aAxzEyw5mnYRHjPtyBfEun/Montowire-MVP-WebApp?type=design&node-id=337-4965&t=0sFuOhMce0BocbGW-4',
};

const meta = {
  title: 'Buttons/VBtn',
  component: VBtn,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: btnTypeOptions },
    viewMode: { control: 'select', options: viewModeOptions },
    disabled: { control: 'boolean' },
    icon: {
      control: 'select',
      options: {
        'No icon': null,
        'action-copy': { name: 'action-copy' },
        'action-cross': { name: 'action-cross' },
        'action-go-out': { name: 'action-go-out' },
        'action-lens': { name: 'action-lens' },
        'action-plus': { name: 'action-plus' },
      },
    },
    default: { control: 'text' },
    // @ts-ignore
    onClick: { action: 'clicked' },
  },
  args: {
    default: 'Button',
  },
  parameters: {
    design: {
      type: 'figma',
      url: FIGMA_LINKS.main,
    },
  },
} satisfies Meta<typeof VBtn>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: (args, { component }) => {
    return {
      components: { VBtn },
      setup: () => setupStory({ args, component }),
      template: `
        <VBtn v-bind="onlyProps" v-on="onlyActions">
          {{ args.default }}
        </VBtn>`,
    };
  },
};

export const Primary: Story = {
  ...Template,
  name: 'Standart',
  args: { viewMode: 'primary' },
};

export const Critical: Story = {
  ...Template,
  args: { viewMode: 'critical-primary' },
};

export const PrimaryDisabled: Story = {
  ...Template,
  args: {
    viewMode: 'primary',
    disabled: true,
  },
};

export const Ghost: Story = {
  ...Template,
  args: { viewMode: 'ghost-primary' },
};

export const GhostDisabled: Story = {
  ...Template,
  args: {
    viewMode: 'ghost-primary',
    disabled: true,
  },
};
