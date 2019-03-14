import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class LandingService {
    constructor(private http: HttpClient) {}

    getLocation() {
        const location = new Subject<any>();

        this.getIpAddress().subscribe(({ ip }) => {
            this.http.get(`https://api.ipgeolocation.io/ipgeo?ip=${ip}`).subscribe(data => location.next(data));
        });
        return location.asObservable();
    }

    getIpAddress() {
        const ip = new Subject<any>();
        this.http.get(`https://api.ipify.org?format=json`).subscribe(data => ip.next(data));
        return ip.asObservable();
    }
}