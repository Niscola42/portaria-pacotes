import { Resident } from "./types";

export const residents: Resident[] = [
  { id: "r1", name: "Maria Silva", block: "A", apartment: "101", phone: "5571999991001" },
  { id: "r2", name: "João Santos", block: "A", apartment: "102", phone: "5571999991002" },
  { id: "r3", name: "Ana Oliveira", block: "A", apartment: "201", phone: "5571999991201" },
  { id: "r4", name: "Carlos Souza", block: "B", apartment: "101", phone: "5571999992101" },
  { id: "r5", name: "Beatriz Lima", block: "B", apartment: "204", phone: "5571999992204" },
  { id: "r6", name: "Pedro Costa", block: "C", apartment: "302", phone: "5571999993302" },
];

export const doorman = "Marcos Almeida";

export function residentLabel(resident: Resident) {
  return `Bloco ${resident.block} · Apto ${resident.apartment}`;
}
