import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'bim-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  constructor(private storage: AngularFireStorage) { }

  ngOnInit() {}

  uploadFile(event) {
    const files: FileList = event.target.files;
    const file = files.item(0);
    const filePath = `/files/${file.name}`;
    const task = this.storage.upload(filePath, file);
  }
}
