import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
         
import { DictionaryService, Dictionary } from '../dictionary.service';
import { debounceTime } from  "rxjs/operators";

function isSubsequence( small : string[], big : string[] ): boolean {
    // both are sorted arrays of characters
    var i : number = 0; // index into small
    var j : number = 0; // index into big
    while ( i < small.length ) {
        if ( j >= big.length ) {
            // Ran out of big before finding all the letters in small.
            return false;
        } else if ( small[i] == big[j] ) {
            i += 1;
            j += 1;
        } else if ( small[i] > big[j] ) {
            // Might be later in the big
            j += 1;
        } else {
            // Can't be later in big, not present.
            return false;
        }
    }
    return true;
}

class SearchResults {
    words: string[];
    time: number;

    sortByLength() {
        this.words.sort( lengthCompare );
    }
};

class Column {
    constructor( public start : number, public end : number ) {
    }
};

type WordChecker = ( word: string[] ) => boolean;

function wordSearchFiltered( wordList : string[],
                             searchLetters : string [],
                             valid : WordChecker ) : string[] {
    var result : string[] = [];
    for (var w = 0; w < wordList.length; ++w) {
        const word = wordList[w];
        if ( searchLetters.length < word.length ) {
            var wordLetters = Array.from( word );
            wordLetters.sort();
            if ( isSubsequence( searchLetters, wordLetters ) ) {
                if ( valid( wordLetters ) ) {
                    result.push( word );
                }
            }

        }
    }
    return result;
}

function wordSearch( wordList : string[],
                     searchLetters : string[],
                     additionalLetters : string[] ) : SearchResults {
    const start = performance.now();
    var results = new SearchResults();

    let check : WordChecker = function( word : string[] ) : boolean {
        return true;
    };
    
    if ( additionalLetters.length > 0 ) {
        var permittedLetters : string[] = searchLetters.concat( additionalLetters );
        permittedLetters.sort();
        check = function( word : string[] ) : boolean {
            return isSubsequence( word, permittedLetters );
        }
    }

    
    results.words = wordSearchFiltered( wordList, searchLetters, check );    
    const end = performance.now();
    results.time = end - start;
    return results;
}

function lengthCompare( a : string, b : string ) : number {
    if ( a.length < b.length ) {
        // Put shorter strings *later* in the list
        return 1;
    } else if ( a.length > b.length ) {
        return -1;
    } else {
        return a.localeCompare( b );
    }
}

@Component({
  selector: 'app-wordsearch',
  templateUrl: './wordsearch.component.html',
  styleUrls: ['./wordsearch.component.css']
})

export class WordsearchComponent implements OnInit {
    loading = true;
    loadError = false;
    loaded = false;  
    words : string[];
    searchInput = new FormControl('');    
    additionalInput = new FormControl('');
    searchLetters : string[] = [];
    additionalLetters : string[] = [];
    
    searchResults : SearchResults = new SearchResults();
    showSearchResults = false;  
    numWordsToShow = 0;
    moreAvailable : number = 0;
    columns : Column[] = [];
    
    constructor( dictionaryService : DictionaryService) {
        dictionaryService.getDictionary()
            .subscribe(
                ( d : Dictionary ) => {
                    this.loading = false;
                    this.loaded = true;
                    this.words = d.wordList;
                },
                error => {
                    this.loading = false;
                    this.loadError = true;
                }
            );
    }

    reflowColumns() {
        var numWords = this.searchResults.words.length;

        if ( this.numWordsToShow > numWords ) {
            this.numWordsToShow = numWords;
        }

        const n = this.numWordsToShow;
        if ( n < 10 ) {
            this.columns = [
                new Column( 0, n ),
            ]
        } else if ( n < 20 ) {
            const half = Math.ceil( n / 2 );
            this.columns = [
                new Column( 0, half ),
                new Column( half, n ),
            ]
        } else {
            const t1 = Math.ceil( n / 3 );
            const t2 = Math.ceil( 2 * n / 3 );
            this.columns = [
                new Column( 0, t1 ),
                new Column( t1, t2 ),
                new Column( t2, n ),
            ]
        }

        this.moreAvailable = this.searchResults.words.length - n;
    }

    moreWords( additional : number ) {
        if ( additional == -1 ) {
            this.numWordsToShow = this.searchResults.words.length;
        } else {
            this.numWordsToShow += additional;
        }
        this.reflowColumns();
    }
    
    performSearch() {
        this.searchResults = wordSearch( this.words, this.searchLetters,
                                         this.additionalLetters );
        this.searchResults.sortByLength();
        this.numWordsToShow = 40;

        if ( this.searchResults.words.length < 60 ) {
            this.numWordsToShow = this.searchResults.words.length;
        }
          
        this.reflowColumns();
        this.showSearchResults = true;
    }
    
    startSearch() {
        this.searchLetters = Array.from( this.searchInput.value.toUpperCase() );
        this.searchLetters.sort();
        
        this.additionalLetters = Array.from( this.additionalInput.value.toUpperCase() );
        this.additionalLetters.sort();
        
        this.showSearchResults = false;
        
        if ( this.searchLetters.length > 0 ) {
            this.performSearch();
        }
    }
    
    ngOnInit() {
        this.searchInput.valueChanges
            .pipe( debounceTime( 500 ) )
            .subscribe( newValue => this.startSearch() );
        this.additionalInput.valueChanges
            .pipe( debounceTime( 500 ) )
            .subscribe( newValue => this.startSearch() );
    }
}
