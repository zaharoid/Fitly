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
    }, {
      id: 'activityLevel',
      title: 'Activity Level:',
      description: goal.activityLevel,
    }, {
      id: 'weight',
      title: 'Weight:',
      description: `${goal.weightCurrent}kg`,
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