export interface Assignee {
  name: string;
  id: string;
}

export interface InventoryItem {
  name: string;
  id: string;
}

export interface Task {
  id: string;
  name: string;
}

export type StepType = "details" | "date" | "guests";

export type EventType = "wedding" | "birthday" | "concert" | "conference" | "sports" | "corporate" | "charity" | "others" | "";

export interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export interface EventDetailsData {
  eventName: string;
  eventType: EventType;
  customEventType: string;
  description: string;
}

export interface DateLocationData {
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: Date | null;
  endTime: Date | null;
  location: string;
  selectedClientId: string;
}

export interface TasksAssigneesData {
  tasks: Task[];
  selectedAssignees: Assignee[];
  selectedItems: InventoryItem[];
}