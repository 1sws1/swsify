let currentsong = new Audio()
let songs
let currentfolder
let currentIndex = 0
const play = document.querySelector(".playbutton");

async function getsongs(folder) {
    currentfolder = folder
    let a = await fetch(`/songs/${folder}/songs.json`)
    songs = await a.json()

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        let cleaned = song.replaceAll("%20", " ").replaceAll("%5C", " ")
        songUL.innerHTML = songUL.innerHTML + `<li><img src="pics/music-02-stroke-rounded.png" alt="" class="invert music" height="30">
                    <div class="info">
                        <div>${cleaned}</div>
                        
                    </div>
                    <div class="playnow pointer">
                    play now
                    <img src="play.png" alt="" height="30" class="invert pointer">
                    </div>
                    </li>`
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", element => {
            currentIndex = index
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
}

const playmusic = (track, pause=false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/songs/${currentfolder}/` + track
    if(!pause){
     currentsong.play()
     play.src = "pause.png"
    }
    
    document.querySelector(".songinfo").innerHTML= track.replaceAll("%20"," ").replaceAll("%5C"," ")
    document.querySelector(".songtime").innerHTML= "00:00 / 00:00"
    
}
function secondstominutesecond(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}





async function main() {

    //get the list of songs
    await getsongs("radio")
    playmusic(songs[0], true)
    console.log(songs)
    

    
     currentsong.addEventListener("timeupdate", ()=>{
         if (!Number.isFinite(currentsong.duration)){ return "00:00";}
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML= `${secondstominutesecond(currentsong.currentTime)}:${secondstominutesecond(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100 +"%"
       
     })

     document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100 
         document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100 +"%"
         currentsong.currentTime= (currentsong.duration*percent)/100
     })
   document.querySelector(".hamburger").addEventListener("click",()=>{
       document.querySelector(".left").style.left ="-4%"
   })
   document.querySelector(".close").addEventListener("click",()=>{
       document.querySelector(".left").style.left ="-100%"
   })
   const previous = document.querySelector(".previous")
   
   const next = document.querySelector(".next")
     
    play.addEventListener("click", ()=>{
    if (currentsong.paused) {
        currentsong.play()
        play.src = "pause.png"
    }
    else {
        currentsong.pause()
        play.src = "play.png"
    }
})
previous.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    playmusic(songs[currentIndex]);
  }
});

next.addEventListener("click", () => {
  if (currentIndex < songs.length - 1) {
    currentIndex++;
    playmusic(songs[currentIndex]);
  }
});
document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
       console.log("setting value to",e.target.value, "out of 100")
       currentsong.volume= parseInt(e.target.value)/100
})

   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click", async item=>{
        await getsongs(`${item.currentTarget.dataset.folder}`)
        currentIndex = 0
    })
   })

}

main()

