
export enum ColumnType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  CONDITION = 'CONDITION',
  HP = 'HP'
}

export interface ColumnDefinition {
  id: string;
  label: string;
  type: ColumnType;
  isCustom?: boolean;
}

export interface Character {
  id: string;
  [key: string]: string | number | undefined;
}

export const CONDITIONS = [
  'None',
  'Blinded',
  'Charmed',
  'Deafened',
  'Exhaustion',
  'Frightened',
  'Grappled',
  'Incapacitated',
  'Invisible',
  'Paralyzed',
  'Petrified',
  'Poisoned',
  'Prone',
  'Restrained',
  'Stunned',
  'Unconscious'
];

export const INITIAL_COLUMNS: ColumnDefinition[] = [
  { id: 'name', label: 'Name', type: ColumnType.STRING },
  { id: 'nickname', label: 'Nickname', type: ColumnType.STRING },
  { id: 'hp', label: 'HP', type: ColumnType.HP },
  { id: 'ac', label: 'AC', type: ColumnType.INTEGER },
  { id: 'initiative', label: 'Initiative', type: ColumnType.INTEGER },
  { id: 'attack', label: 'Attack', type: ColumnType.STRING },
  { id: 'attackDamage', label: 'Attack Damage', type: ColumnType.STRING },
  { id: 'reaction', label: 'Reaction', type: ColumnType.STRING },
  { id: 'bonusAction', label: 'Bonus Action', type: ColumnType.STRING },
  { id: 'legendaryActions', label: 'Legendary Actions', type: ColumnType.STRING },
  { id: 'savingThrows', label: 'Saving Throws', type: ColumnType.STRING },
  { id: 'str', label: 'Str', type: ColumnType.INTEGER },
  { id: 'dex', label: 'Dex', type: ColumnType.INTEGER },
  { id: 'cos', label: 'Cos', type: ColumnType.INTEGER },
  { id: 'int', label: 'Int', type: ColumnType.INTEGER },
  { id: 'wis', label: 'Wis', type: ColumnType.INTEGER },
  { id: 'cha', label: 'Cha', type: ColumnType.INTEGER },
  { id: 'condition', label: 'Condition', type: ColumnType.CONDITION }
];
