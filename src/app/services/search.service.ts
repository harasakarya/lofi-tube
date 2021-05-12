import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map,catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  private API_TOKEN = 'AIzaSyAXlxTNHS15PXgS40tXfeomHc3rC61-Gmg';

  constructor(private http: HttpClient) {}

  getVideos(query: string, results: number): Observable <any> {
    const url = `${this.API_URL}?q=${query}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=${results}`;
    return this.http.get(url)
      .pipe(
        map((response: any) => response.items)
      );
  }
}