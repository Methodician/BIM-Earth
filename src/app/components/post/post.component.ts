import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'bim-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnChanges {
  @Input() post;
  @Input() userInfo;
  @Output() openLightboxRequest = new EventEmitter<string>();
  @Output() viewUpdateRequest = new EventEmitter<null>();
  authorName: string = "Guest User";
  images = [];
  imagesLoaded = false;
  files = [];
  filesLoaded = false;
  headerImage;

  get postDate() {
    if (this.post.timestamp) return `${this.post.timestamp.getMonth()+1}/${this.post.timestamp.getDay()}/${this.post.timestamp.getYear() - 100} at ${this.post.timestamp.getHours()}:${this.post.timestamp.getMinutes()}`;
    else return "Pending"
  }

  get title() {
    return this.post.title;
  }

  get postBody() {
    return this.post.description;
  }

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes: ', changes)
    if(!this.post.images.length) {
      this.images = this.getArrayfromObject("images");
      this.headerImage = this.images.shift();
      this.imagesLoaded = true;
    }
    if(!this.post.files.length) {
      this.files = this.getArrayfromObject("files");
      this.filesLoaded = true;
    }
    if(changes.userInfo.currentValue) {
      this.authorName = this.userInfo[this.post.author].alias;
    }
  }

  getArrayfromObject(fileType: "images" | "files") {
    let fileArray = [];
    for(let key in this.post[fileType]) {
      fileArray.push(this.post[fileType][key]);
    }
    return fileArray;
  }

  panelOpened() {
    this.ref.detectChanges();
    console.log('panel opened')
  }

  openLightbox(photoURL: string) {
    this.openLightboxRequest.emit(photoURL);
  }

  backupViewCheck() {
    window.setTimeout(_ => {
      console.log('timeouted view update requested from post');
      this.viewUpdateRequest.emit();
    }, 2500);
    // this.viewUpdateRequest.emit();
  }
}
