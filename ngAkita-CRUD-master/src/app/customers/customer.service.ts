import { CustomerStore } from "./state/customer.store";
import { Customer } from "./customer.model";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Injectable()
export class CustomerService {

customerForm = new FormGroup({
    idInput: new FormControl(null),
    id: new FormControl(null),
    name: new FormControl('',Validators.required),
    email: new FormControl('',Validators.required),
})

http: HttpClient;
store: CustomerStore;
apiURL = "http://localhost:3000"

constructor(http: HttpClient, store: CustomerStore) {
this.http = http;
this.store = store;

}

getAllCustomers(): Observable<any> {
return this.http.get<any>('https://mou0egt4sl.execute-api.us-east-2.amazonaws.com/customers').pipe(
    tap(customers => {
     customers = customers.Items ;
     
      let customerList : Customer[] = [] ;

      let cus : Customer ;
      customers.forEach(item =>  {
         cus  = {
          'id': item['id'],
          'name' : item['name'],
          'email' : item['email']
        }
        
        

        customerList.push(cus) ;

      });

    this.store.loadCustomers(customerList, true);
    })
);
}

createCustomer(customer: Customer): Observable<Customer> {
 /* cus  = {
    'id': null,
    'name' : item['name'],
    'email' : item['email']
  }*/
    return this.http.put<Customer>('https://mou0egt4sl.execute-api.us-east-2.amazonaws.com/customers', customer).pipe(
      tap(value => {
        this.store.add([customer]);
      })
    );
  }

deleteCustomer(customerId: string): Observable<any> {
  return this.http.delete('https://mou0egt4sl.execute-api.us-east-2.amazonaws.com/customers/' + customerId).pipe(
    tap(result => {
      this.store.remove(customerId);
    })
  );
}

updateCustomer(customerId: string, customer: Customer): Observable<any> {
  this.customerForm.controls['idInput'].enable();
    customer.id = customerId ;
    
  return this.http.put('https://mou0egt4sl.execute-api.us-east-2.amazonaws.com/customers', customer).pipe(
    tap(result => {
      this.store.update(customerId, customer);
      this.deleteCustomer(customerId) ;

    })
  );
}
populateCustomerForm(customer){
    this.customerForm.get('idInput').setValue(customer.id)
    this.customerForm.get('id').setValue(customer.id)
    this.customerForm.get('name').setValue(customer.name)
    this.customerForm.get('email').setValue(customer.email)
    this.customerForm.controls['idInput'].disable();

}
}
