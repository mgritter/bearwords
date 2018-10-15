import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Dictionary {
  wordList : string[];
  suffixTree : any;
}

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class DictionaryService {
  constructor(private http: HttpClient) { }

  dictionaryUrl = "assets/dictionary.json";

  getDictionary() {
    return this.http.get<Dictionary>( this.dictionaryUrl );
  }
}
