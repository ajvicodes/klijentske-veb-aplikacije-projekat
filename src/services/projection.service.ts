import { ProjectionModel } from '../models/projection.model';

export class ProjectionService {
  // Pravimo niz projekcija kao statičku listu (hardkodovano)
  static projections: ProjectionModel[] = [
    { id: 1, movieId: 1, projectionDate: '2025-07-02', projectionTime: '18:30', ticketPrice: 500, },
    { id: 2, movieId: 1, projectionDate: '2025-07-02', projectionTime: '21:00', ticketPrice: 600, },
    { id: 3, movieId: 2, projectionDate: '2025-07-03', projectionTime: '20:00', ticketPrice: 550, },
  ];

  // Vrati sve projekcije (bez parametra)
  static getProjections(): ProjectionModel[] {
    return this.projections;
  }

  // Vrati samo projekcije za dati film
  static getProjectionsForMovie(movieId: number): ProjectionModel[] {
    return this.projections.filter(p => p.movieId === movieId);
  }

  // Vrati projekciju po id-ju
  static getProjectionById(id: number): ProjectionModel | undefined {
    return this.projections.find(p => p.id === id);
  }
}
