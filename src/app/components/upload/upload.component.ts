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
  tasks: AngularFireUploadTask[] = [];
  imageTasks: AngularFireUploadTask[] = [];
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
    let filePaths = [];
    let imagePaths = [];
    for(let file in this.queue) {
      let path = `/tests/${this.queue[file].blob.name}`;
      let task = this.storage.upload(path, this.queue[file].blob, { customMetadata: {id: this.firestore.createId(), postId: postId, featureId: featureId }});
      if(this.imageTypes[this.queue[file].blob.type]) {
        task.downloadURL()
        imagePaths.push(path);
        this.imageTasks.push(task);
      } else {
        filePaths.push(path);
        this.tasks.push(task);
      }
    }

    let taskURLs = this.tasks.map(task => task.downloadURL());
    let imageURLs = this.imageTasks.map(task => task.downloadURL());
    Observable.forkJoin(taskURLs).subscribe(urls => {
      let obsArr = filePaths.map(path => this.storage.ref(path).getMetadata())
      Observable.forkJoin(obsArr).subscribe(metadatas => {
        let files = {};
        metadatas.forEach(data => {
          files[data.customMetadata.id] = {
            url: data.downloadURLs[0],
            name: data.name,
            size: data.size
          }
        })
        this.mapSvc.updatePostFiles(featureId, postId, "files", files);
      });
    }, error => console.log('task error: ', error));
    
    Observable.forkJoin(imageURLs).subscribe(urls => {
      let obsArr = imagePaths.map(path => this.storage.ref(path).getMetadata())
      Observable.forkJoin(obsArr).subscribe(metadatas => {
        let images = {};
        metadatas.forEach(data => {
          images[data.customMetadata.id] = {
            url: data.downloadURLs[0],
            name: data.name,
            size: data.size
          }
        })
        this.mapSvc.updatePostFiles(featureId, postId, "images", images);
      });
    }, error => console.log('image error: ', error))
  }
}
