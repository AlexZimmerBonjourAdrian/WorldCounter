// Capa de Data Types - Modelos UI para el contador de palabras
// DTOs inmutables que fluyen entre componentes

export interface CounterUIProps {
  readonly text: string;
  readonly onTextChange: (text: string) => void;
}
