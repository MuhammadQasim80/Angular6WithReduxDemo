import { ADD_CUSTOMER, EDIT_CUSTOMER, DELETE_CUSTOMER } from './actions';
import { tassign } from 'tassign';
import { IAppState } from './store';
export function rootReducer(state: IAppState, action): IAppState {
    const custCrud = new CustomerCrud(state, action);
    switch (action.type) {
        case ADD_CUSTOMER:
            return tassign(state, { customers: custCrud.addCustomer() });
        case EDIT_CUSTOMER:
            return tassign(state, { customers: custCrud.editCustomer() });
        case DELETE_CUSTOMER:
            return tassign(state, { customers: custCrud.deleteCustomer() });
        default:
            return state;
    }
}

class CustomerCrud {
    private currentState: IAppState;
    private action: any;

    constructor(state: IAppState, action) {
        this.currentState = state;
        this.action = action;
    }

    addCustomer() {
        return this.currentState.customers.concat(this.action.customer);
    }

    editCustomer() {
        const customers = this.currentState.customers.slice(0);
        const editingCustIndex = customers.findIndex((c) => c.customerID === this.action.customer.customerID);
        if (editingCustIndex === -1) {
            return customers;
        }
        customers.splice(editingCustIndex, 1, this.action.customer);
        return customers;
    }

    deleteCustomer() {
        const customers = this.currentState.customers.slice(0);
        const deletingCustIndex = customers.findIndex((c) => c.customerID === this.action.customer.customerID);
        if (deletingCustIndex === -1) {
            return customers;
        }
        customers.splice(deletingCustIndex, 1);
        return customers;
    }
}
