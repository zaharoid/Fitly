import type { InfoItem } from "~/types/InfoList";

export type DtoProfile = {
  id: string;
  sex: string;
  age: string;
  heightCm: string;
  weightKg: string;
}

function mapGender (gender: string) {
  return gender === 'm' ? 'Male' : 'Female';
}

export function getProfileInfo (data: DtoProfile): InfoItem[] {
  return [
    {
      id: 'sex',
      title: 'Gender:',
      description: mapGender(data.sex),
    }, {
      id: 'age',
      title: 'Age:',
      description: data.age,
    }, {
      id: 'height',
      title: 'Height:',
      description: `${data.heightCm}cm`,
    }, {
      id: 'weight',
      title: 'Weight:',
      description: `${data.weightKg}kg`,
    }
  ]
}