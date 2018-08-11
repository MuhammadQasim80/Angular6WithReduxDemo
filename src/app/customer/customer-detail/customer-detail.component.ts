import { ADD_CUSTOMER, EDIT_CUSTOMER } from './../../store/actions';
import { IAppState } from './../../store/store';
import { Igender } from './../../interfaces/Igender';
import { Icustomer } from './../../interfaces/icustomer';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgbDatepicker, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { select, NgRedux } from '../../../../node_modules/ng2-redux';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit, OnChanges {
  @select(s => s.customers) customers$;
  public customers: Icustomer[];

  @Input()
  customerDetail: Icustomer;

  birthdayModel: NgbDateStruct;
  lastContactDateModel: NgbDateStruct;
  lastContactTimeModel: NgbTimeStruct;

  selectedGender: any;
  genderList: Array<Igender> = [
    {
      Name: '--',
      Val: '',
      IsSelected: true
    },
    {
      Name: 'Male',
      Val: 'm',
      IsSelected: false,
    },
    {
      Name: 'Female',
      Val: 'w',
      IsSelected: false
    }
  ];

  constructor(private custStore: NgRedux<IAppState>) {
    this.customers$.subscribe(c => this.customers = c);
  }

  ngOnInit() {
    if (this.customerDetail) {
      this.onGenderChange(this.customerDetail.gender);

      let bd = new Date(this.customerDetail.birthday);
      this.birthdayModel = { day: bd.getDate(), month: bd.getMonth() + 1, year: bd.getFullYear() };

      bd = new Date(this.customerDetail.lastContact);
      this.lastContactDateModel = { day: bd.getDate(), month: bd.getMonth() + 1, year: bd.getFullYear() };
      this.lastContactTimeModel = { hour: bd.getHours(), minute: bd.getMinutes(), second: bd.getSeconds() };

    } else {
      this.customerDetail = this.getCustomerTemplate();
      this.onGenderChange('');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  onGenderChange(gender: string) {
    this.genderList.forEach((g) => {
      g.IsSelected = false;
      if (g.Val === gender) {
        g.IsSelected = true;

        if (this.customerDetail) {
          this.customerDetail.gender = g.Val;
        }
      }
    });
  }

  private getCustomerTemplate() {
    let maxIdCustomer = null;
    if (this.customers && this.customers.length > 0) {
      maxIdCustomer = this.customers.reduce((pv: Icustomer, cv: Icustomer) => {
        return pv.customerID > cv.customerID ? pv : cv;
      });
    }

    return {
      customerID: maxIdCustomer ? maxIdCustomer.customerID + 1 : 1,
      birthday: new Date(),
      customerLifetimeValue: 0,
      gender: '',
      lastContact: new Date(),
      name: {
        first: '',
        last: ''
      }
    };
  }

  submit(t: any) {
    const bd = t.value.birthday;
    let month: any = bd.month;
    month = month < 10 ? '0' + month : month;
    let day = bd.day;
    day = day < 10 ? '0' + day : day;
    const birthday = `${bd.year}-${month}-${day}`;

    const lcDate = t.value.lastContactDateModel;
    const lcTime = t.value.lastContactTimeModel;
    const lc: Date = new Date(lcDate.year, lcDate.month - 1, lcDate.day, lcTime.hour, lcTime.minute, lcTime.second);

    const editedObj: Icustomer = {
      customerID: this.customerDetail.customerID,
      birthday: birthday,
      customerLifetimeValue: t.value.customerLifetimeValue,
      gender: t.value.gender,
      lastContact: lc.toISOString(),
      name: {
        first: t.value.firstName,
        last: t.value.lastName
      }
    };

    this.custStore.dispatch({
      type: this.isEditMode(editedObj) ? EDIT_CUSTOMER : ADD_CUSTOMER,
      customer: editedObj
    });
  }

  private isEditMode(custObj: Icustomer) {
    if (this.customers && this.customers.length > 0) {
      return this.customers.findIndex((o) => o.customerID === custObj.customerID) !== -1;
    }

    return false;
  }
}
