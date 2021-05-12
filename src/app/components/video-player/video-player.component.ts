import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent{

  urls: string[] = [];
  hardCodedBackup = ["5qap5aO4i9A","DWcJFNfaw9c","tXwRYCht9AM","-5KAN9_CzSA","5yx6BWlEVcY","UoMbwCoJTYM","TbAjL4qgzC0","rc9cjjEun_k","lTRiuFIWV54"]
  current: number = 0;
  safeURL:SafeResourceUrl = "";
  wasFailure = false;

  constructor(private search: SearchService, private sanitizer: DomSanitizer) { 
    if(localStorage.getItem("urls")) {
      this.urls = JSON.parse(localStorage.getItem("urls") || "");
    } else {
      this.fetchVideos(search,10);
    }
  }

  private fetchVideos(search: SearchService, results: number){
    search.getVideos("lofi",results).subscribe( 
      x =>{
        x.map( (x: { id: { videoId: string; }; }) => this.urls.push(x.id.videoId));
        this.updateVideo(this.current);
        console.log(this.urls);
        localStorage.setItem("urls", JSON.stringify(this.urls));
        },
      
      error => {
        this.urls = this.hardCodedBackup;
        this.wasFailure = true;
        this.updateVideo(this.current);
        console.log(this.urls);
        localStorage.setItem("urls", JSON.stringify(this.urls));
      }
      );
  }

  updateVideo(i: number){
    this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+this.urls[i]+'?autoplay=1');
    console.log(this.safeURL);
  }

  forward(){
    if(this.current < this.urls.length -1) {
      this.updateVideo(++this.current) 
    } else {
      if(this.wasFailure){
         this.current = 0;
         this.updateVideo(this.current); 
      } else {
        this.fetchVideos(this.search, this.urls.length+10);
      }
    }
}

  back(){

    if(this.current >0) this.updateVideo(--this.current);
  }


}
