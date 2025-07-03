import { HttpParams } from "@angular/common/http";
import { PaginatorEvent } from "./page";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  constructor() { }

  /**
   * Buduje obiekt HttpParams na podstawie PaginatorEvent i opcjonalnych filtrów.
   * Konwertuje 'first' i 'rows' na 'page' i 'size' dla Spring Boot.
   * @param event Obiekt PaginatorEvent.
   * @param customFilters Obiekt z dodatkowymi filtrami niestandardowymi (np. nameFilter).
   * @returns Obiekt HttpParams gotowy do użycia w zapytaniu HTTP.
   */
  getPaginationAndFilterParams(event: PaginatorEvent, customFilters: { [key: string]: string | number | boolean } = {}): HttpParams {
    // Obliczanie 'page' na podstawie 'first' i 'rows'
    const page = event.rows > 0 ? Math.floor(event.first / event.rows) : 0;
    const size = event.rows;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set("paginate", "true");

    // Ustawianie parametrów sortowania
    if (event.sortField) {
      const sortDirection = event.sortOrder === 1 ? 'asc' : 'desc'; // Przyjmuje 1 dla ASC, -1 dla DESC
      params = params.set('sort', `${event.sortField},${sortDirection}`);
    } else {
      // Domyślne sortowanie, jeśli nie ma z paginatora, np. po ID rosnąco
      params = params.set('sort', `id,asc`);
    }

    // Dodawanie niestandardowych filtrów
    for (const key in customFilters) {
      if (customFilters.hasOwnProperty(key) && customFilters[key] !== null && customFilters[key] !== '') {
        params = params.set(key, customFilters[key].toString());
      }
    }

    // Opcjonalnie: obsługa filtrów z samego PaginatorEvent (jeśli biblioteka UI je zawiera)
    // if (event.filters) {
    //   for (const key in event.filters) {
    //     if (event.filters.hasOwnProperty(key) && event.filters[key] !== null && event.filters[key] !== '') {
    //       params = params.set(key, event.filters[key].toString());
    //     }
    //   }
    // }

    return params;
  }
}