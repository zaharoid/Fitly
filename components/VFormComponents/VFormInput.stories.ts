import type { Meta, StoryObj } from '@storybook/vue3';
import * as Yup from 'yup';
import VFormInput from './VFormInput.vue';
import { setupStory } from '~/.storybook/helpers/setupStory';

const FIGMA_LINKS = {
  Primary: 'https://www.figma.com/file/aAxzEyw5mnYRHjPtyBfEun/Montowire-MVP-WebApp?type=design&node-id=255-2178&t=0sFuOhMce0BocbGW-4',
};

const nameInput = 'storybook_input_name';

const meta = {
  title: 'VForm/VFormInput',
  component: VFormInput,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    viewMode: {
      control: 'select',
      options: {
        limited: 'limited',
        half: 'half',
        'stardart (empty)': '',
      },
    },
    viewMessage: {
      control: 'select',
      options: {
        absolute: 'absolute',
        hide: 'hide',
        'stardart (empty)': '',
      },
    },
    successMessage: { control: 'text' },
    name: { table: { disable: true } },
    id: { control: 'text' },
    type: { control: 'text' },
    modelValue: { control: 'text' },
    funcBtn: { control: 'object' },
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
  args: {
    label: 'Label',
    name: nameInput,
    id: 'storybook_input_name',
    type: 'text',
    modelValue: 'Some content text',
    placeholder: 'Type something...',
  },
} satisfies Meta<typeof VFormInput>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: (args, { component }) => {
    return {
      components: { VFormInput },
      setup: () => {
        const validationSchema = {
          [nameInput]: Yup.string().required('Field is required'),
        };

        return {
          ...setupStory({ args, component }),
          validationSchema,
        };
      },
      template: `
        <VForm :validation-schema="validationSchema">
          <VFormInput v-bind="onlyProps" v-on="onlyActions" />
        </VForm>`,
    };
  },
};

export const Primary: Story = {
  ...Template,
  parameters: {
    design: {
      type: 'figma',
      url: FIGMA_LINKS.Primary,
    },
  },
};
