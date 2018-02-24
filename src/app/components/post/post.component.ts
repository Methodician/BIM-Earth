import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'bim-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnChanges {
  @Input() post;
  @Input() userInfo;
  authorName: string = "Guest User";
  images = [];
  imagesLoaded = false;
  files = [];
  filesLoaded = false;
  headerImage;
  friendlyDate: string = "";

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.post.images.length) {
      this.images = this.getArrayfromObject("images");
      this.headerImage = this.images.shift();
      this.imagesLoaded = true;
    }
    if(!this.post.files.length) {
      this.files = this.getArrayfromObject("files");
      this.filesLoaded = true;
    }
    if(!this.friendlyDate && this.post.timestamp) {
      this.friendlyDate = this.postDate;
    }
    if(changes.userInfo.currentValue) {
      this.authorName = this.userInfo[this.post.author].alias;
    }
  }

  get postDate() {
    let minutes = this.post.timestamp.getMinutes() > 10 ? this.post.timestamp.getMinutes() : `0${this.post.timestamp.getMinutes()}`;
    let hours = this.post.timestamp.getHours() == 0 ? "00" : this.post.timestamp.getHours();
    return `${this.post.timestamp.toLocaleDateString()} at ${hours}:${minutes}`;
  }

  getArrayfromObject(fileType: "images" | "files") {
    let fileArray = [];
    for(let key in this.post[fileType]) {
      fileArray.push(this.post[fileType][key]);
    }
    return fileArray;
  }

  checkView() {
    this.ref.detectChanges();
  }
}
