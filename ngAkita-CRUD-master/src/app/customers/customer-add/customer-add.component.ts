import { CustomerService } from "../customer.service";
import { CustomerStore } from "../state/customer.store";
import { Customer } from "../customer.model";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit,OnDestroy {
  createCustomerSub: Subscription;
  updateCustomereSub: Subscription;
  customerToBeUpdated: Customer;
  isDisabled = false ;

  constructor(public customerService: CustomerService , private store:CustomerStore) { }
  

  ngOnInit(): void {
   
  }

  onSubmit(){
    if (this.customerService.customerForm.get('id').value === null ) {
      console.log(this.customerService.customerForm.value);
      
      const customer: Customer = {
        id : this.customerService.customerForm.value.idInput,
        name: this.customerService.customerForm.value.name,
        email: this.customerService.customerForm.value.email,
       };
     this.createCustomerSub = this.customerService.createCustomer(customer).subscribe( 
      
       
     );
     this.customerService.customerForm.reset()
     this.customerService.getAllCustomers()

    } else {

      console.log(this.customerService.customerForm.value);
      const customer: Customer = {
        id : this.customerService.customerForm.value.idInput,
        name: this.customerService.customerForm.value.name,
        email: this.customerService.customerForm.value.email,
       };
      this.customerToBeUpdated = customer;
      this.updateCustomereSub = this.customerService.updateCustomer(
        this.customerService.customerForm.get('id').value, customer).subscribe(result => this.customerService.getAllCustomers()
      );
     
      this.customerService.customerForm.reset()
    }
  }
  resetform(){

    this.customerService.customerForm.reset();
    this.customerService.customerForm.controls['idInput'].enable();



  }
  ngOnDestroy(): void {
    if (this.updateCustomereSub) {
     this.updateCustomereSub.unsubscribe();
    }  
  }
}