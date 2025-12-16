export interface VectorQueryResult<T> {
  document: T;
  distance: number; // Lower is better (0 = identical, 1 = completely different)
  score?: number; // Higher is better (0-100, 100 = perfect match)
}
