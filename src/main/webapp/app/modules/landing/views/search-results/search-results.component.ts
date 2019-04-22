import { Options } from 'ng5-slider';
import { SearchRealStateQuery } from './../../@akita/search/search.query';
import { Observable, Subject } from 'rxjs';
import { SearchFilter } from 'app/@akita/external-models/searchFilter';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RealState, RealStateService } from 'app/@akita/real-state';
import { MatDrawer } from '@angular/material';
import { LocationFiltersService } from 'app/shared/location-filters/location-filters.service';
import { LocationFiltersComponent } from 'app/shared/location-filters/location-filters.component';
import { Title } from '@angular/platform-browser';
import { MetaService } from 'app/shared/meta.service';

@Component({
    selector: 'jhi-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
    selectedIndex = 0;

    /** Queries */
    title = 'Buscar casas, apartamentos y lotes en Costa Rica';
    loading$: Observable<boolean>;
    loadMore$: Observable<boolean>;
    elements$: Observable<RealState[]>;
    priceRange$: Observable<Options>;
    sizeRange$: Observable<Options>;
    loadingLocation = true;

    /** Filters */
    locationFilters: SearchFilter = new SearchFilter();
    appartmentFilters: SearchFilter = new SearchFilter();
    lotFilters: SearchFilter = new SearchFilter();
    homeFilters: SearchFilter = new SearchFilter();

    @ViewChild('drawer') drawer: MatDrawer;
    @ViewChild('locationFilters') locationFiltersComponent: LocationFiltersComponent;

    /** Range */
    mobile = window.innerWidth <= 550;
    priceRange: Options = {
        ceil: 90000000,
        floor: 0
    };
    sizeRange: Options = {
        ceil: 900,
        floor: 0
    };

    constructor(
        private realStateService: RealStateService,
        private searchRealStateQuery: SearchRealStateQuery,
        private locationFiltersService: LocationFiltersService,
        private titleService: Title,
        private meta: MetaService
    ) {}

    ngOnInit() {
        this.meta.createCanonicalURL();
        this.meta.addTag('robots', 'index, follow');
        this.titleService.setTitle(this.title);

        /** Price Range */
        const { provincia, loading } = this.locationFiltersService.getProvincia();
        loading.subscribe(loadingLocation => {
            this.loadingLocation = loadingLocation;
        });
        provincia.subscribe(provincia => {
            if (provincia) {
                this.locationFiltersComponent.setProvincia(provincia);
            }
            const priceRange$ = new Subject<Options>();
            this.searchRealStateQuery.priceRange$.subscribe(data => {
                if (data.ceil >= this.priceRange.ceil) {
                    this.priceRange.ceil = data.ceil;
                    this.setRange('rangePrice', data.ceil);
                }
                priceRange$.next({ ...data, ...this.priceRange } as Options);
            });
            this.priceRange$ = priceRange$.asObservable();
            /** Size range */
            const sizeRange$ = new Subject<Options>();
            this.searchRealStateQuery.sizeRange$.subscribe(data => {
                if (data.ceil >= this.sizeRange.ceil) {
                    this.sizeRange.ceil = data.ceil;
                    this.setRange('rangeSize', data.ceil);
                }
                sizeRange$.next({ ...data, ...this.sizeRange } as Options);
            });
            this.loading$ = this.searchRealStateQuery.selectLoading();
            this.loadMore$ = this.searchRealStateQuery.loadMore$;
            this.sizeRange$ = sizeRange$.asObservable();
            this.elements$ = this.searchRealStateQuery.elements$;
            this.applyFilters();
        });
    }

    setRange(name, ceil) {
        if (ceil) {
            switch (this.selectedIndex) {
                case 0:
                    this.homeFilters[name].high = ceil;
                    this.homeFilters[name].low = 0;
                    this.homeFilters[name] = { ...this.homeFilters[name] };
                    break;
                case 1:
                    this.appartmentFilters[name].high = ceil;
                    this.appartmentFilters[name].low = 0;
                    this.appartmentFilters[name] = { ...this.appartmentFilters[name] };
                    break;
                case 2:
                    this.lotFilters[name].high = ceil;
                    this.lotFilters[name].low = 0;
                    this.lotFilters[name] = { ...this.lotFilters[name] };
                    break;
            }
        }
    }

    applyFilters() {
        switch (this.selectedIndex) {
            case 0:
                this.realStateService.searchHomes(this.getFilters());
                break;
            case 1:
                this.realStateService.searchAppartments(this.getFilters());
                break;
            case 2:
                this.realStateService.searchLots(this.getFilters());
                break;
        }

        if (this.mobile) {
            this.drawer.close();
        }
    }

    getFilters() {
        let filter: SearchFilter = this.locationFilters;
        switch (this.selectedIndex) {
            case 0:
                filter = {
                    ...filter,
                    ...this.homeFilters
                } as SearchFilter;
                break;
            case 1:
                filter = {
                    ...filter,
                    ...this.appartmentFilters
                } as SearchFilter;
                break;
            case 2:
                filter = {
                    ...filter,
                    ...this.lotFilters
                } as SearchFilter;
                break;
        }
        return filter;
    }

    selectedIndexChange() {
        this.priceRange = {
            ceil: 0,
            floor: 0
        };
        this.sizeRange = {
            ceil: 0,
            floor: 0
        };
        this.setRange('rangeSize', this.getFilters().sizeHigh);
        this.setRange('rangePrice', this.getFilters().prHigh);
        this.applyFilters();
    }

    provinciaContext() {
        this.applyFilters();
    }

    loadMore() {
        this.realStateService.loadMore();
    }
}
