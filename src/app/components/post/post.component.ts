import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bim-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  @Input() post;
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

  get author() {
    return this.post.author;
  }

  constructor() {}

  ngOnInit() {
    if(!this.post.images.length) {
      this.images = this.getArrayfromObject("images");
      this.headerImage = this.images.shift();
      this.imagesLoaded = true;
    }
    if(!this.post.files.length) {
      this.files = this.getArrayfromObject("files");
      this.filesLoaded = true;
    }
  }

  getArrayfromObject(fileType: "images" | "files") {
    let fileArray = [];
    for(let key in this.post[fileType]) {
      fileArray.push(this.post[fileType][key]);
    }
    return fileArray;
  }

}
