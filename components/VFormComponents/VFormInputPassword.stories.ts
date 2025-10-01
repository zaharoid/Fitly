import type { Meta, StoryObj } from '@storybook/vue3';
import * as Yup from 'yup';
import VFormInputPassword from './VFormInputPassword.vue';
import { setupStory } from '~/.storybook/helpers/setupStory';

const FIGMA_LINKS = {
  Primary: 'https://www.figma.com/file/aAxzEyw5mnYRHjPtyBfEun/Montowire-MVP-WebApp?type=design&node-id=267-2418&t=0sFuOhMce0BocbGW-4',
};

const nameInput = 'storybook_input_password';

const meta = {
  title: 'VForm/VFormInputPassword',
  component: VFormInputPassword,
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
    modelValue: { control: 'text' },
    // @ts-ignore
    'onUpdate:modelValue': { action: 'update:modelValue' },
  },
  args: {
    label: 'Password',
    name: nameInput,
    id: 'storybook_input_password',
    modelValue: '12345',
    placeholder: 'Enter password',
  },
} satisfies Meta<typeof VFormInputPassword>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: Story = {
  render: (args, { component }) => {
    return {
      components: { VFormInputPassword },
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
          <VFormInputPassword v-bind="onlyProps" v-on="onlyActions" />
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
