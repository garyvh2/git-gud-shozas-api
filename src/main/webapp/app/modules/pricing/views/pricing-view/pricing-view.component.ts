import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { SearchFilter } from 'app/@akita/external-models/searchFilter';
import { PricingService } from '../../pricing.service';
import { ApiResponse } from 'app/@akita/external-models/apiResponse.model';
import { RealState } from 'app/@akita/real-state';
import { Observable } from 'rxjs';

@Component({
    selector: 'jhi-pricing-view',
    templateUrl: './pricing-view.component.html',
    styleUrls: ['./pricing-view.component.scss']
})
export class PricingViewComponent implements OnInit {
    priceRange: Options = {
        ceil: 0,
        floor: 0
    };
    sizeRange: Options = {
        ceil: 0,
        floor: 0
    };

    homeFilters: SearchFilter = new SearchFilter();

    averagePrice = 0;

    showCanvas = false;

    pricingIllustrationURL = 'https://res.cloudinary.com/shozas/image/upload/v1555192506/housebuild.gif';

    loading = false;

    realStates: RealState[];

    constructor(private pricingService: PricingService) {}

    ngOnInit() {
        this.homeFilters.sizeLow = 100;
        this.homeFilters.baths = 1;
        this.homeFilters.beds = 1;
        this.homeFilters.garages = 1;
        this.homeFilters.stories = 1;
        this.homeFilters.similarTo = true;
    }

    applyFilters() {
        this.loading = true;

        this.pricingService.getPricing(this.homeFilters).subscribe(
            response => {
                console.log(response);
                this.averagePrice = response.result.averagePrice;
                this.updateIllustration(response);
                this.realStates = response.result.elements;
                this.loading = false;
            },
            error => {}
        );
    }

    updateIllustration(response) {
        if (response.result.elements.length > 0) {
            this.pricingIllustrationURL = response.result.elements[0].image.source;
            this.showCanvas = false;
        }
    }
}
