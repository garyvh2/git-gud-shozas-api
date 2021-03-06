import { UserService } from './../../@akita/user/user.service';
import { ID } from '@datorama/akita';
import { User } from './../../@akita/user/user.model';
import { Component, OnInit, Output, Input, OnChanges } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RealState } from 'app/@akita/real-state';

@Component({
    selector: 'jhi-typeahead',
    templateUrl: './typeahead.component.html',
    styleUrls: ['./typeahead.component.scss']
})
export class TypeaheadComponent implements OnInit, OnChanges {
    @Input()
    realState: RealState;
    @Input()
    users: string[] = [];
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    filteredUsers: Observable<User[]>;
    allUsers: User[] = [];

    @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    tagCtrl: FormControl;
    inputCtrl = new FormControl('');
    emailCtrl = new FormControl('', Validators.email);

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.tagCtrl = new FormControl('', this.Validatetags);
    }
    ngOnChanges() {
        this.loadTags();
    }
    loadTags() {
        if (this.realState) {
            this.userService.getInterested(this.realState.id).subscribe((data: any) => {
                this.allUsers = data.result;
                this.updateFilterList();
            });
        }
    }

    Validatetags = () => {
        const isNotValid = this.users.length === 0;
        if (isNotValid) {
            return { emptyTags: isNotValid };
        }
        return null;
    };
    add(event: MatChipInputEvent): void {
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value || '';
            this.emailCtrl.setValue(value);
            if (this.emailCtrl.valid) {
                if (value.trim() && !this.isAlreadyOnList(value)) {
                    this.users.push(value.trim());
                }

                if (input) {
                    input.value = '';
                }

                this.tagCtrl.setValue(null);
                this.emailCtrl.setValue('');
                this.emailCtrl.markAsPristine();
                this.emailCtrl.markAsUntouched();
            } else {
                this.emailCtrl.markAsTouched();
                this.emailCtrl.markAsDirty();
            }
        }
    }

    remove(tag: User): void {
        this.users = [];
        this.updateFilterList();
    }
    selected(event: MatAutocompleteSelectedEvent): void {
        const value = event.option.value;
        if (!this.isAlreadyOnList(value.name)) {
            this.users.push(value);
            this.tagInput.nativeElement.value = '';
            this.tagCtrl.setValue(null);
            this.updateFilterList();
        }
    }

    private isAlreadyOnList(value: string): boolean {
        const findRow = this.users.find(tag => tag.toLowerCase() === value.toLowerCase());
        return !!findRow || this.users.length === 1;
    }
    updateFilterList() {
        this.filteredUsers = this.inputCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: User | string | null) => (tag ? this._filter(tag) : this.notIncludedTags().slice(0, 10)))
        );
    }
    private notIncludedTags(): User[] {
        return this.allUsers.filter(userlist => {
            return !this.users.some(user => userlist.login === user);
        });
    }
    private _filter(user: any): User[] {
        const value = user.login ? user.login : user;
        const filterValue = value.toLowerCase();
        const notAddedUsers = this.notIncludedTags();
        return notAddedUsers.filter(notAddedUser => notAddedUser.login.toLowerCase().indexOf(filterValue) === 0);
    }
}
