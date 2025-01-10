export default interface Element {
  type: string;
  offsetX: number;
  offsetY: number;
  width?: number;
  height?: number;
  path?: [number, number][];
  stroke: string;
}
