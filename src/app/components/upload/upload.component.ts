import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';
import { AngularFirestore } from 'angularfire2/firestore';
import { MapService } from '@services/map.service';
import { ImageComponent } from 'ngx-mapbox-gl/src/app/lib/image/image.component';

@Component({
  selector: 'bim-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  queue = {};
  queueArray = [];
  imageTypes = {
    "image/jpeg": true,
    "image/png": true,
    "image/gif": true,
    "image/svg+xml": true
  };

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private mapSvc: MapService,
  ) { }

  ngOnInit() {}

  clearFiles() {
    this.queue = {};
    this.updateQueueArray();
  }
  
  addToQueue(files: FileList) {
    for(let i = 0, length = files.length; i < length; i++) {
      let file = {
        blob: files.item(i),
        uid: `${i}${files.item(i).name}`
      }
      this.queue[file.uid] = file;
    }
    this.updateQueueArray();
    this.fileInput.nativeElement.value = null;
  }

  updateQueueArray() {
    this.queueArray = [];
    for(let file in this.queue) {
      this.queueArray.push({
        name: this.queue[file].blob.name,
        uid: this.queue[file].uid
      });
    }
  }

  removeFromQueue(uid) {
    delete this.queue[uid];
    this.updateQueueArray();
  }

  startUpload(featureId: string, postId: string) {
    let files = [];
    let fileURLs = [];
    let images = [];
    let imageURLs = [];
    for(let file in this.queue) {
      let path = `/tests/${this.queue[file].blob.name}`;
      let task = this.storage.upload(path, this.queue[file].blob, { customMetadata: {id: this.firestore.createId(), postId: postId, featureId: featureId }});
      if(this.imageTypes[this.queue[file].blob.type]) {
        images.push({
          path: path,
          task: task
        })
      } else {
        files.push({
          path: path,
          task: task
        })
      }
    }

    fileURLs = files.map(file => file.task.downloadURL());
    imageURLs = images.map(image => image.task.downloadURL());
    // once all urls have been returned, getMetadata() can be called without erroring
    Observable.forkJoin(fileURLs).subscribe(urls => {
      let obsArr = files.map(file => this.storage.ref(file.path).getMetadata())
      Observable.forkJoin(obsArr).subscribe(metadatas => {
        let filesData = {};
        metadatas.forEach(data => {
          files[data.customMetadata.id] = {
            url: data.downloadURLs[0],
            name: data.name,
            size: data.size
          }
        })
        this.mapSvc.updatePostFiles(featureId, postId, "files", filesData);
      });
    }, error => console.log('task error: ', error));
    // once all urls have been returned, getMetadata() can be called without erroring
    Observable.forkJoin(imageURLs).subscribe(urls => {
      let obsArr = images.map(image => this.storage.ref(image.path).getMetadata())
      Observable.forkJoin(obsArr).subscribe(metadatas => {
        let imagesData = {};
        metadatas.forEach(data => {
          images[data.customMetadata.id] = {
            url: data.downloadURLs[0],
            name: data.name,
            size: data.size
          }
        })
        this.mapSvc.updatePostFiles(featureId, postId, "images", imagesData);
      });
    }, error => console.log('image error: ', error))
  }
}
