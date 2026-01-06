import { parseISO } from 'date-fns';
import type { InfoItem } from '~/types/InfoList';
import type { DtoSingleGoal } from '~/types/responces/goal';

export function mapGoalInfo (goal: DtoSingleGoal): InfoItem[] {
  console.log(
    'Mapping goal info:',
    goal
  );
  
  return [
    {
      id: 'weight',
      title: 'Desired weight:',
      description: goal.weightTarget + 'kg',
      classNames: 't-text-cards',
    }, {
      id: 'activityLevel',
      title: 'Activity Level:',
      description: goal.activityLevel,
      classNames: 't-text-cards',
    }, {
      id: 'height',
      title: 'Height:',
      description: `${goal}cm`,
      classNames: 't-text-cards',
    }, {
      id: 'weight',
      title: 'Weight:',
      description: `${goal.weightTarget}kg`,
      classNames: 't-text-cards',
    }
  ]
}

export function mapOriginGoal (goal: DtoSingleGoal) {
  console.log(goal);
  return {
    ...goal,
    deadline: parseISO(goal.deadline),
  }
}