import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'bim-boundary-form',
  templateUrl: './boundary-form.component.html',
  styleUrls: ['./boundary-form.component.scss']
})
export class BoundaryFormComponent implements OnInit {
  @Input() initialValue;
  form: FormGroup;
  accessLevels: string[] = ['public', 'private', 'locked'];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      zapId: ['', Validators.required],
      accessLevel: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.setInitialValue()
  }

  setInitialValue() {
    if(this.initialValue) {
      this.form.patchValue(this.initialValue)
    }
  }

  get invalid() {
    return !this.form.valid;
  }

  get value() {
    return this.form.value;
  }

  clear() {
    this.form.setValue({zapId: "", accessLevel: ""})
  }
}
