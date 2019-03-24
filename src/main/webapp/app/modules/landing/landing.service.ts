import { Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IP_LOCATION_API_KEY } from 'app/app.constants';

@Injectable()
export class LandingService {
    constructor(private http: HttpClient) {}

    getLocation() {
        const location = new Subject<any>();

        this.getIpAddress().subscribe(({ ip }) => {
            this.http
                .get(`https://api.ipgeolocation.io/ipgeo?apiKey=${IP_LOCATION_API_KEY}&ip=${ip}`)
                .subscribe(data => location.next(data), () => location.error('Imposible encontrar la ubicación del usuario.'));
        });
        return location.asObservable();
    }

    getIpAddress() {
        const ip = new Subject<any>();
        this.http.get(`https://api.ipify.org?format=json`).subscribe(data => ip.next(data));
        return ip.asObservable();
    }
}
