import { DELETE_CUSTOMER } from './../../store/actions';
import { IAppState } from './../../store/store';
import { Icustomer } from './../../interfaces/icustomer';
import { DataService } from './../../providers/data-service/data-service.service';
import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from 'ng2-redux';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  @select(s => s.customers) customers$;
  // customers: Array<Icustomer>;
  selectedCustomer: Icustomer;
  constructor(public dataSvc: DataService, private custStore: NgRedux<IAppState>) { }

  ngOnInit() {
  }

  selectCustomer(c: Icustomer) {
    this.selectedCustomer = c;
  }

  deleteCustomer(c: Icustomer) {
    this.custStore.dispatch({
      type: DELETE_CUSTOMER,
      customer: c
    });
  }

  addCustomer() {
    this.selectedCustomer = null;
  }
}
